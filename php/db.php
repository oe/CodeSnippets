<?php

class Common_Db
{
  private $dbh = null;
  private $stmt = null;
  private $debug = false;
  private static $instance = array();
  public static function getInstance($config = array())
  {
    $default = array(
      'driver'    => 'pgsql',
      'DBIP'      => 'localhost',
      'DBPort'    => 5432,
      'DBName'    => 'postgre',
      'UserID'    => 'postgre',
      'DBPassWord'  => 'postgre',
      'charset'   => 'utf8',
      'debug'     => 0,
      'timeout'   => 3,
      'persist'   => 0
    );
    $config = array_merge($default, array_intersect_key($config, $default));
    $key = md5(implode(',', $config));
    return isset(self::$instance[$key]) ? self::$instance[$key] : (self::$instance[$key] = new self($config));
  }
  private function __construct($config)
  {
    $this->debug = $config['debug'] ? true : false;
    $dsn = $config['driver'] . ':host=' . $config['DBIP'] . ';port=' . $config['DBPort'] . ';dbname=' . $config['DBName'];
    try
    {
      $driverOptions = array(
        PDO::ATTR_ERRMODE       => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE  => PDO::FETCH_ASSOC,
        PDO::ATTR_TIMEOUT       => $config['timeout'],
        PDO::ATTR_PERSISTENT      => $config['persist']
      );
      $this->dbh = new PDO($dsn, $config['UserID'], $config['DBPassWord'], $driverOptions);
      if ( !empty($config['charset']) )
      {
        $this->dbh->query("SET NAMES '{$config['charset']}'");
      }
    }
    catch (PDOException $e)
    {
      error_log($e->getMessage());
      throw $e;
    }
  }
  public function __destruct()
  {
    foreach (self::$instance as $key => $obj)
    {
      if ( $obj === $this )
      {
        unset(self::$instance[$key]);
      }
    }
  }
  public function getOne($sql, $arr = array())
  {
    $this->_outputLog($sql, $arr);
    $result = '';
    try
    {
      $this->stmt = $this->dbh->prepare($sql);
      $this->stmt->execute($arr);
      $result = $this->stmt->fetchColumn();
    }
    catch (PDOException $e)
    {
      $this->_outputLog($e);
    }

    return $result;
  }
  public function getRow($sql, $arr = array())
  {
    $this->_outputLog($sql, $arr);
    $result = array();
    try
    {
      $this->stmt = $this->dbh->prepare($sql);
      $this->stmt->execute($arr);
      $result = $this->stmt->fetch();
    }
    catch (PDOException $e)
    {
      $this->_outputLog($e);
    }

    return $result;
  }
  public function getAll($sql, $arr = array())
  {
    $this->_outputLog($sql, $arr);
    $result = array();
    try
    {
      $this->stmt = $this->dbh->prepare($sql);
      $this->stmt->execute($arr);
      $result = $this->stmt->fetchAll();
    }
    catch (PDOException $e)
    {
      $this->_outputLog($e);
    }

    return $result;
  }
  public function execute($sql, $arr = array())
  {
    $this->_outputLog($sql, $arr);
    $result = false;
    try
    {
      $this->stmt = $this->dbh->prepare($sql);
      $result = $this->stmt->execute($arr);
      $result = $this->stmt->rowCount() ? true : false;
      if ( $result )
      {
        if ( 0 === stripos($sql,'insert') )
        {
          $lastInsertId = $this->dbh->lastInsertId();
          if ( $lastInsertId )
          {
            $result = $lastInsertId;
          }
          elseif ( strpos(strtolower($sql), ' returning ') !== false )
          {
            $returning = $this->stmt->fetchColumn();
            $result = $returning ? $returning : $result;
          }
        }
      }
    }
    catch (PDOException $e)
    {
      $this->_outputLog($e);
    }

    return $result;
  }
  public function getHandler()
  {
    return $this->dbh;
  }
  public function getStatement()
  {
    return $this->stmt;
  }
  protected function _outputLog($e, $arr = array())
  {
    if ( $e instanceof PDOException)
    {
      error_log($e->getMessage());
      throw $e;
    }
    elseif ( $this->debug )
    {
      error_log($e);
      $arr ? error_log(strtr(var_export($arr, true), array("\n" => ''))) : null;
    }
  }
}
