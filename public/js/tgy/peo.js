angular.module('App', []);

function peopleCtrl($scope, $http, $templateCache){
  //加载时判断是否已经关注了该用户，这里用jquery处理，angular处理有点坑
  var ifWatch=$("#watchP").attr("isWatch");
  if(ifWatch=="true"){
    $("#watchOk").hide();
    $("#watchNo").show();
  }else if(ifWatch=="false"){
    $("#watchOk").show();
    $("#watchNo").hide();
  }else{
    //如果是本人页面
    $("#watchP").hide();
  }

	//关注用户
	var myName=$("#pageName").attr("pName");
  $scope.watchPeo=function(){
    $http({method: "GET", url: "/watchPeople?name="+myName, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          $("#watchOk").hide();
          $("#watchNo").show();
        }else{
          $("#watchOk").hide();
          $("#watchNo").show();
          alert(data.message);
        }
      });
  }

  $scope.unwatchPeo=function(){
    $http({method: "GET", url: "/unwatchPeople?name="+myName, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          $("#watchOk").show();
          $("#watchNo").hide();
        }
      });
  }

	//股票实时数据
	function ajaxStock(){
		$scope.method = 'JSONP';
    stockCode=$("#stockList").attr("my-stock");
    //$scope.url = 'http://xueqiu.com/stock/quote.json?code='+pathUrl+'&callback=JSON_CALLBACK';
    if(stockCode==""){
      //如果没有信息，就不请求
      return;
    }
    $scope.url = 'http://xueqiu.com/stock/quote.json?code='+stockCode+'&key=47bce5c74f&access_token=aZy51015GfDGsvsNtit2XY&_=1384782884165&callback=JSON_CALLBACK';
    $scope.code = null;
    $scope.response = null;
    $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
      success(function(data, status) {
        for(var i=0,l=data.quotes.length;i<l;i++){
          data.quotes[i].volume=(data.quotes[i].volume/10000).toFixed(2);
          data.quotes[i].marketCapital=(data.quotes[i].marketCapital/100000000).toFixed(2)
          if(Number(data.quotes[i].change)>0){
            data.quotes[i].zdClass="red";
            data.quotes[i].zdBack="danger";
            data.quotes[i].change="+"+data.quotes[i].change;
            data.quotes[i].percentage="+"+data.quotes[i].percentage+"%";
          }else if(Number(data.quotes[i].change)==0){
            data.quotes[i].zdClass="";
            data.quotes[i].zdBack="";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }else{
            data.quotes[i].zdClass="green";
            data.quotes[i].zdBack="success";
            data.quotes[i].percentage=data.quotes[i].percentage+"%";
          }
        }
        $scope.stocks=watchList=data.quotes;
      });
	}
	ajaxStock();
  var hours;
  var now;
  function start(){
     now = new Date();
     hours = now.getHours();
     if(hours>9&&hours<15){
        ajaxStock();
        setTimeout(start,10000);
     }
  }

  //展示关注的用户
  //没做分页效果
  $scope.watchTab=function(){
    var pageNum=0;
    var pageSize=10;
    var name=$("#pageName").attr("pname");
    $http({method: "GET", url: "/peopleWatchTab?name="+name+"&pageNum="+pageNum+"&pageSize="+pageSize, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          watchAndFens(data.list);
          $scope.looks=data.list;
        }
      });
  }

  //展示粉丝
  $scope.fensTab=function(){
    var pageNum2=0;
    var pageSize2=10;
    var name=$("#pageName").attr("pname");
    $http({method: "GET", url: "/peopleFensTab?name="+name+"&pageNum="+pageNum2+"&pageSize="+pageSize2, cache: $templateCache}).
      success(function(data,status){
        if(data.ok){
          watchAndFens(data.list);
          $scope.fens=data.list;
        }
      });
  }


  /*
  公用函数
  */
  //处理关注和粉丝的数据
  var watchAndFens=function(data){
    for(var i=0,l=data.length;i<l;i++){
      if(data[i].myself){
        data[i].watch=false;
        data[i].unwatch=false;
      }else{
        if(data[i].haveWatch){//false表示没有关注
          data[i].watch=false;
          data[i].unwatch=true;
        }else{
          data[i].watch=true;
          data[i].unwatch=false;
        }
      }
    }
  }
};