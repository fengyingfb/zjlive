
      !(function(){
        var uniAppViewReadyCallback = function(){
          setCssToHead(["body, wx-view { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; }\nbody { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; min-height: 100%; background-color: #EFEFEF; }\nwx-template { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-flex: 1; -webkit-flex: 1; -ms-flex: 1; flex: 1; }\nbody { background-color: #000; }\nwx-swiper { -webkit-box-flex: 1; -webkit-flex: 1; -ms-flex: 1; flex: 1; width: ",[0,750],"; background-color: #000; display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-orient: vertical; -webkit-box-direction: normal; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; }\nwx-swiper-item { display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-box-align: center; -webkit-align-items: center; -ms-flex-align: center; align-items: center; }\nwx-image { width: ",[0,750],"; height: ",[0,1125],"; }\n",],undefined,{path:"./pages/detail/detail.wxss"})();
document.dispatchEvent(new CustomEvent("generateFuncReady", { detail: { generateFunc: $gwx('./pages/detail/detail.wxml') } }));
        }
        if(window.__uniAppViewReady__){
          uniAppViewReadyCallback()
        }else{
          document.addEventListener('uniAppViewReady',uniAppViewReadyCallback)
        }
      })();
      