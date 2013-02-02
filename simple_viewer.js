
var setting = {
 url:location.href,
 dir:'img/',
 main_width:'450',
 main_height:'300',
 sub_width:'100',
 sub_height:'100',
 img_num:9,
 lim_num:4
}

setting.img_num++;

var re = new RegExp("^.*/");
setting.url = re.exec(setting.url);

var Photo = function(){
  this.top = '';
  this.img = '';
};

Photo.prototype = {
  getId:function(id,content){
    var element = document.getElementById(id);
    element.innerHTML = content;
  },
  img_area:function(start,end){
    var m = '';
    var t = '<table>';
    var le = '';

    for(var i=start;i<=end;i++){
       if(i == setting.img_num){
         break;
       }
       if(i == start){
         le+='<img src="'+setting.url+setting.dir+i+'.jpg" width="'+setting.main_width+'" height="'+setting.main_height+'">';
       }
       if((i!=0) && (i%setting.lim_num) == 0){
         m = '<tr>'+m+'</tr><tr>';
       }
       m+='<td><img class="s_img" src="'+setting.url+setting.dir+i+'.jpg" class="photos" width="'+setting.sub_width+'" height="'+setting.sub_height+'"></td>';

    }
    m = t+m+'</tr></table>';
    this.top = le;
    this.img = m;
  },
  img_object:function(){
    var imgs = [this.top,this.img];
    return imgs;
  },
  click_e:function(e){
    var type = new RegExp(".*\.jpg$");
    var srcpath = '';
    for(var i=0;i<e.target.attributes.length;i++){
       if(e.target.attributes[i].value.match(type)){
        srcpath = e.target.attributes[i].value;
        break;
       }else{
        srcpath = '';
       }
    }
    var clickimg = '<img src="'+srcpath+'" width="'+setting.main_width+'" height="'+setting.main_height+'">';
 
    var m = new Photo();
    var kn = e.target.attributes[3].value.split('/');
    var filenum = kn[kn.length-1].split('.jpg')[0];
    var xhr = new Photo_data();
    xhr.req_open('pin',filenum);
    m.getId('display_area',clickimg);
  }
};

var Photo_data = function(){
  this.xhr = new XMLHttpRequest();
};

Photo_data.prototype = {
    req_open:function(id,filenum){
    this.xhr.open('GET','./yo.txt',true);
    var self = this;

    this.xhr.onreadystatechange = function(){
      var alice = document.getElementById(id);
      var text = self.xhr.responseText.split('\n')[filenum];
      if(text != undefined){
        alice.innerHTML = text
      }
    };
    this.xhr.send(null);
  }
};


var Slid = function(){
  this.current = Math.ceil(setting.img_num / setting.lim_num);
  this.next = '';
};

Slid.prototype = {
  get_locat:function(){
    var loc = location.href;
    if(loc.match(/^.*\?next=(.+$)/)){
      return RegExp.$1;
    }
  },
  is_next:function(e){
    this.next = Math.ceil(setting.img_num / setting.lim_num);

    if(this.next > 0){
        var s = new Slid();
        var num = Number(s.get_locat());

        if(num.toString() == 'NaN'){
          num = 1;
          e.target.setAttribute('href',location.href+'?next='+num);
        }else{
          if(num < this.next){
            var prev = num;
            num++;
            var newurl = location.href.replace('next='+prev,'next='+num);
            e.target.setAttribute('href',newurl);
          }else{
            e.target.setAttribute('href','');
          }
        }
    }
  },
  page:function(obj){
    var s = new Slid();
    var curr = s.get_locat();

    if(this.current - curr == 1 || typeof(curr) == 'undefined'){
      obj.style.display = 'none';
    }
  },
  back_page:function(e){
    var s = new Slid();
    var curr = s.get_locat();

    if(curr == 1){
        e.target.setAttribute('href','./demo.html');
    }else{
        var bcurr = curr - 1;
        var newurl = location.href.replace('next='+curr,'next='+bcurr);
        e.target.setAttribute('href',newurl);
    }
  },
  init:function(s,e){
    var n = new Photo();
    n.img_area(s,e);
    var img_content = n.img_object();
    n.getId('display_area',img_content[0]);
    n.getId('imgs',img_content[1]);
    var imgs = document.getElementsByTagName('img');

    for(var i=0;i<imgs.length;i++){
       if(imgs[i].className == 's_img'){
          imgs[i].addEventListener('click',n.click_e,false);
       }
    }
  }
}
