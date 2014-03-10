<?php
class Rest
{
	protected static $request = array(
		'resource'	=> '',
		'id'		=> 0,
		'method'	=> 'get',
		'params'	=> array()
	);
	protected static $content = null;
	protected static $e = null;
	public static function router()
	{
		$resource = strtr(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), array(dirname($_SERVER['SCRIPT_NAME']) => ''));
		$resource = explode('/', trim($resource, '/'));
		if ( !is_numeric(self::$request['id'] = array_pop($resource)) )
		{
			self::$request['resource'] = 'Controllers_' . self::$request['id'];
			self::$request['id'] = 0;
		}
		if ( $resource )
		{
			self::$request['resource'] = implode('_', $resource) . (self::$request['resource'] ? '_' . self::$request['resource'] : '');
		}
		self::$request['method'] = strtolower($_SERVER['REQUEST_METHOD']);
		switch (self::$request['method'])
		{
			case 'get':
			case 'delete':
				self::$request['params'] = $_GET;
				break;
			case 'post':
				self::$request['params'] = $_POST;
				break;
			case 'put':
				parse_str(file_get_contents('php://input'), self::$request['params']);
				break;
			default:
				break;
		}
	}
	public static function dispatch()
	{
		try
		{
			$class = self::$request['resource'];
			self::$request['resource'] = strtoupper(self::$request['resource']);
			if ( class_exists($class) )
			{
				$method = self::$request['method'];
				if ( method_exists($class, $method) )
				{
					$class = new $class(self::$request);
					if ( $class->checkAuth() )
					{
						$class->$method();
						self::$content = $class->getResponse();
						if ( is_null(self::$content) )
						{
							self::$e = new Exception('Method Not Allowed', 405);
						}
						else
						{
							self::$e = new Exception('OK', 200);
						}
					}
					else
					{
						self::$e = new Exception('Unauthorized', 401);
					}
				}
				else
				{
					self::$e = new Exception('Method Not Allowed', 405);
				}
			}
			else
			{
				self::$e = new Exception('Not Found', 404);
			}
		}
		catch(Exception $e)
		{
			self::$e = $e;
		}
	}
	public static function response()
	{
		header('HTTP/1.1 ' . self::$e->getCode() . ' ' . self::$e->getMessage());
		header('Content-type: application/json; charset=utf-8');
		if ( self::$e->getCode() == 200 )
		{
			self::$content = json_encode(self::$content);
		}
		else
		{
			self::$content = json_encode(array('code' => self::$e->getCode(), 'message' => self::$e->getMessage()));
		}
		if ( isset($_SERVER['HTTP_ACCEPT_ENCODING']) )
		{
			if ( strtr($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip', '') != $_SERVER['HTTP_ACCEPT_ENCODING'] )
			{
				self::$content = gzencode(self::$content, 9, FORCE_GZIP);
			}
			elseif ( strtr($_SERVER['HTTP_ACCEPT_ENCODING'], 'deflate', '') != $_SERVER['HTTP_ACCEPT_ENCODING'] )
			{
				self::$content = gzencode(self::$content, 9, FORCE_DEFLATE);
			}
		}
		echo self::$content;
	}
}
class RestController
{
	protected $request = array();
	protected $response = null;
	protected static $userOnlyIF = array(
		'PUR_CONTROLLERS_USER' 					=> array('get', 'put'),
		'PUR_CONTROLLERS_CONTRACT'				=> array('get'),
		'PUR_CONTROLLERS_CHECKCONTRACT'			=> array('get'),
		'PUR_CONTROLLERS_AUTHENTICATION'		=> array('post', 'delete'),
		'PRL_CONTROLLERS_MAPRELEASE'			=> array('get'),
		'PCT_CONTROLLERS_CONTENTSMNG'			=> array('get'),
		'PRL_CONTROLLERS_UPDATECONTENTSRANGE'	=> array('get'),
		'PRL_CONTROLLERS_UPDATETABLERANGE'		=> array('get'),
		'PCT_CONTROLLERS_CHECKCONTENTS'			=> array('get'),
		'PCT_CONTROLLERS_CONTENTS'				=> array('get'),
		'PCT_CONTROLLERS_CONTENTSGROUP'			=> array('get'),
		'PCT_CONTROLLERS_CONTENTSTABLECOLUMN'	=> array('get'),
		'PCT_CONTROLLERS_SCHEMAMNG'				=> array('get'),
		'PCT_CONTROLLERS_TABLEGROUPMNG'			=> array('get'),
		'PFI_CONTROLLERS_GMAPFILE'				=> array('get', 'post'),
		'PFI_CONTROLLERS_MAPFILE'				=> array('get', 'post'),
	);
	public function __construct($request)
	{
		$this->request = $request;
	}
	final public function getResponse()
	{
		return $this->response;
	}
	public function checkAuth()
	{
		$_SESSION['user_id_pk'] = isset($_SESSION['user_id_pk']) ? $_SESSION['user_id_pk'] : '';
		$_SESSION['session_start_time'] = isset($_SESSION['session_start_time']) ? $_SESSION['session_start_time'] : date('YmdHis');
		$_SESSION['last_access_time'] = isset($_SESSION['last_access_time']) ? $_SESSION['last_access_time'] : $_SERVER['REQUEST_TIME'];

		$result = false;
		if ( 'PUR_CONTROLLERS_AUTHENTICATION' == $this->request['resource'] )
		{
			if ( 'delete' == $this->request['method'] )
			{
				if ( $_SESSION['user_id_pk'] )
				{
					$result = true;
				}
			}
			else
			{
				$result = true;
			}
		}
		else
		{
			if ( $_SESSION['user_id_pk'] && isset($_SESSION['user_class']))
			{
				if ( $_SERVER['REQUEST_TIME'] - $_SESSION['last_access_time'] <= 1800 )
				{
					$_SESSION['last_access_time'] = $_SERVER['REQUEST_TIME'];
					if ( $_SESSION['user_class'] === 1 )
					{
						if ( isset(self::$userOnlyIF[$this->request['resource']]) )
						{
							if ( in_array($this->request['method'], self::$userOnlyIF[$this->request['resource']]) )
							{
								$prefix = substr($this->request['resource'], 0,	3);
								if ( $prefix === 'PUR' )
								{
									if( $this->request['method'] === 'put' )
									{
										if( isset($this->request['params']['condition']['user_id_pk']) && 
											($_SESSION['user_id_pk'] === strtolower($this->request['params']['condition']['user_id_pk'])) )
										{
											$result = true;
											unset($this->request['params']['data']['user_class'],$this->request['params']['data']['account_stat']);
										}
									}
									else
									{
										if ( isset($this->request['params']['user_id_pk']) && 
											($_SESSION['user_id_pk'] === strtolower($this->request['params']['user_id_pk'])) )
										{
											$result = true;
										}
									}
								}
								elseif ( $prefix === 'PFI' )
								{
									if ( $this->request['method'] === 'post' ) 
									{
										if ( isset($this->request['params']['user_id']) && 
											($_SESSION['user_id_pk'] == strtolower($this->request['params']['user_id'])) )
										{
											$result = true;
										}
									}
									else
									{
										if ( isset($this->request['params']['user_id']) ) 
										{
											if ( $_SESSION['user_id_pk'] == strtolower($this->request['params']['user_id']) ) 
											{
												$result = true;
											}
										}
										else
										{
											$this->request['params']['user_id'] = $_SESSION['user_id_pk'];
											$result = true;
										}
									}
								}
								else
								{
									$result = true;
								}
							}
						}
					}
					elseif( $_SESSION['user_class'] === 2 )
					{
						$result = true;
					}
				}
				else
				{
					$conn = new PUR_Models_Connection;
					$conn->deleteUserConnInfo(array('user_id_pk'=>$_SESSION['user_id_pk'])) and session_destroy();
				}
			}
		}

		return $result;
	}
	public function get(){}
	public function post(){}
	public function put(){}
	public function delete(){}
}