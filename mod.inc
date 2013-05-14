<?php
class Common_Model
{
	protected $config = array();
	protected $db = null;
	protected $table = '';
	protected $fields = array();
	function __construct($localConfigFile = '', $systemConfigFile = '')
	{
		try
		{
			$localConfig = Common_Parse::parseConfig(dirname(APP_PATH) . DS . 'local' . DS .  $localConfigFile);
			$systemConfig = Common_Parse::parseConfig(dirname(APP_PATH) . DS . 'system' . DS . $systemConfigFile);
			$this->config = array_merge($localConfig, $systemConfig);
			Common_LogFile::$logPath = $this->config['LogSetting'];
			$this->db = Common_Db::getInstance($this->config['ConnectDB']);
		}
		catch (Exception $e)
		{
			Common_LogFile::exceptionHandler($e, Common_LogFile::ERR_FATAL_ERROR, get_class($this));
		}
	}
	public function __destruct()
	{
		unset($this->config, $this->db, $this->table, $this->fields);
	}
	public function getDb()
	{
		return $this->db;
	}
	public function create($data, $isFill = true)
	{
		$ret = false;
		$returning = empty($data['RETURNING']) ? '' : ' RETURNING ' . $data['RETURNING'];
		$data = $this->getFields($data,$isFill);
		$keys = array_keys($data);
		$keys = implode(', ', $keys);
		$values = array_values($data);
		$arr = $values;
		$values = str_repeat('?,', count($values));
		$values = substr($values, 0, -1);
		if ( !empty($keys) && !empty($values) )
		{
			$strSql = "INSERT INTO {$this->table}({$keys}) VALUES({$values}){$returning}";
			try
			{
				$ret = $this->db->execute($strSql, $arr);
			}
			catch (Exception $e)
			{
				Common_LogFile::exceptionHandler($e, Common_LogFile::ERR_ERROR, get_class($this));
			}
		}
		return $ret;
	}
	public function retrieve($condition)
	{
		$ret = array();
		$arr = array();
		$distinctOn = '';
		if ( !empty($condition['DISTINCT_ON']) )
		{
			$distinctOn = 'DISTINCT ON(' . $condition['DISTINCT_ON'] . ') ';
		}

		$fetchFields = '*';
		if ( !empty($condition['FETCH_FIELDS']) )
		{
			if ( !empty($condition['JOIN_ON']) || (strtolower(substr(trim($condition['FETCH_FIELDS']), 0, 6)) == 'count(') )
			{
				$fetchFields = trim($condition['FETCH_FIELDS']);
			}
			else
			{
				$fetchFields = $condition['FETCH_FIELDS'];
				$fetchFields = explode(',', $fetchFields);
				$fetchFields = $this->getFields($fetchFields, false, false);
				$fetchFields = implode(',', $fetchFields);
			}
		}

		$filterFields = '';
		if ( !empty($condition['FILTER_FIELDS']) )
		{
			$filterFields = $condition['FILTER_FIELDS'];
		}

		$groupBy = '';
		if ( !empty($condition['GROUP_BY']) )
		{
			$groupBy = ' GROUP BY ' . $condition['GROUP_BY'];
		}

		$orderBy = '';
		if ( !empty($condition['ORDER_BY']) )
		{
			$orderBy = ' ORDER BY ' . $condition['ORDER_BY'];
		}
		
		$limitSize = '';
		if ( !empty($condition['LIMIT_SIZE']) )
		{
			$limitSize = ' LIMIT ? ';
			$arr[] = $condition['LIMIT_SIZE'];
			if ( !empty($condition['OFFSET_NUM']) )
			{
				$limitSize .= ' OFFSET ? ';
				$arr[] = $condition['OFFSET_NUM'];
			}
		}
		
		$tableName = $this->table;
		unset($condition['DISTINCT_ON'],$condition['FETCH_FIELDS'],$condition['FILTER_FIELDS'],$condition['GROUP_BY'],$condition['ORDER_BY'],$condition['LIMIT_SIZE'],$condition['OFFSET_NUM']);
		if (empty($condition['JOIN_ON']))
		{
			$condition = $this->getFields($condition, false);
		}
		else
		{
			$tableName = $condition['JOIN_ON'];
			unset($condition['JOIN_ON']);
		}
		
		$where = implode(' = ? AND ',array_keys($condition));

		if ( $where )
		{
			$where .= ' = ?';
			$arr = array_merge(array_values($condition), $arr);
		}
		if ( $filterFields )
		{
			$where = $where ? $where . ' AND (' . $filterFields . ')' : $filterFields;
		}
		$where = trim($where);
		$where = $where ? ' WHERE ' . $where : '';
		
		$sql = "SELECT {$distinctOn}{$fetchFields} FROM {$tableName}{$where}{$groupBy}{$orderBy}{$limitSize}";
		try
		{
			$ret = $this->db->getAll($sql, $arr);
		}
		catch (Exception $e)
		{
			Common_LogFile::exceptionHandler($e, Common_LogFile::ERR_ERROR, get_class($this));
		}
		$ret = ($ret !== false) ? $ret : array();

		return $ret;
	}
	public function update($condition,$data)
	{
		$ret = false;
		$arr = array();
		$data = $this->getFields($data, false);

		$fields = '';
		foreach ($data as $key => $val)
		{
			$fields .= $key . ' = ?,';
			$arr[] = $val;
		}
		$fields = substr($fields, 0, -1);

		$condition = $this->getFields($condition, false);
		$where = '';
		foreach ($condition as $key => $val)
		{
			$where .= $key . ' = ? AND ';
			$arr[] = $val;
		}
		$where = substr($where, 0, -4);

		if ( !empty($fields) && !empty($where) )
		{
			$strSql = "UPDATE {$this->table} SET {$fields} WHERE {$where}";
			try
			{
				$ret = $this->db->execute($strSql,$arr);
			}
			catch (Exception $e)
			{
				Common_LogFile::exceptionHandler($e, Common_LogFile::ERR_ERROR, get_class($this));
			}
		}

		return $ret;
	}
	public function delete($condition)
	{
		$ret = false;
		$condition = $this->getFields($condition, false);
		$arr = array();
		$where = '';
		foreach ($condition as $key => $val)
		{
			$where .= $key . ' = ? AND ';
			$arr[] = $val;
		}
		$where = substr($where, 0, -4);
		if ( !empty($where) )
		{
			$strSql = "DELETE FROM {$this->table} WHERE {$where}";
			try
			{
				$ret = $this->db->execute($strSql,$arr);
			}
			catch (Exception $e)
			{
				Common_LogFile::exceptionHandler($e, Common_LogFile::ERR_ERROR, get_class($this));
			}
		}

		return $ret;
	}
	protected function getFields($data, $fill = true, $filterKey = true)
	{
		$fields = array();

		if ( !is_array($data) )
		{
			return $fields;
		}

		if ( $filterKey )
		{
			$fields = array_intersect_key($data, $this->fields);
			if ( $fill )
			{
				$fields = array_merge($this->fields, $fields);
			}
		}
		else
		{
			$fields = array_intersect(array_unique($data), array_keys($this->fields));
		}

		return $fields;
	}
}