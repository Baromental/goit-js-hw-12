import{i as a,a as I,S as B}from"./assets/vendor-da186403.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function s(e){if(e.ep)return;e.ep=!0;const r=n(e);fetch(e.href,r)}})();const v="42006022-41a20d969efbb704c546dcbcd",M=document.getElementById("search-form"),P=document.getElementById("search-input"),f=document.getElementById("loading-indicator"),y=document.getElementById("gallery-container"),c=document.getElementById("load-more");let p="",l=1,d=0;M.addEventListener("submit",H);c.innerText="Load more";c.classList.add("hidden");c.addEventListener("click",T);async function H(t){if(t.preventDefault(),p=P.value.trim(),p===""){a.error({title:"Error",message:"Please enter a search term."});return}l=1,F(),R();try{const o=await E();o.hits.length===0?C():(d=o.totalHits,b(o.hits),L(o.hits.length))}catch(o){console.error("Error fetching data:",o),a.error({title:"Error",message:"An error occurred while fetching data. Please try again."})}finally{w()}}async function T(){l+=1,F(),E().then(t=>{t.hits.length===0?C():(d=t.totalHits,b(t.hits),L(t.hits.length),$(t.hits.length))}).catch(t=>{console.error("Error fetching data:",t),a.error({title:"Error",message:"An error occurred while fetching data. Please try again."})}).finally(()=>{w()})}function L(t){d>l*40&&t>0?c.style.display="block":(c.style.display="none",d<=l*40&&a.show({message:"We're sorry, but you've reached the end of search results.",position:"topRight",backgroundColor:"#03a9f4",titleColor:"#FFFFFF",messageColor:"#FFFFFF"}))}function $(t){const o=document.querySelector(".gallery-item").getBoundingClientRect().height;window.scrollBy({top:o*Math.min(2,t),behavior:"smooth"})}function E(){return I.get(`https://pixabay.com/api/?key=${v}&q=${encodeURIComponent(p)}&image_type=photo&orientation=horizontal&safesearch=true&page=${l}&per_page=40`).then(o=>o.data)}function F(){f.classList.remove("hidden")}function w(){f.classList.add("hidden")}function C(){a.info({message:"Sorry, there are no images matching your search query. Please try again.",position:"topRight",color:"#EF4040",progressBarColor:"#B51B1B",messageColor:"#FAFAFB",icon:"./img/bi_x-octagon.svg"})}function R(){y.innerHTML=""}function b(t){const o=new B(".gallery-item a");t.forEach(n=>{const s=document.createElement("div");s.classList.add("gallery-item");const e=document.createElement("a");e.href=n.largeImageURL;const r=document.createElement("img");r.src=n.webformatURL,r.alt=n.tags,r.title=n.tags;const i=document.createElement("ul");i.classList.add("image-desc");const m=document.createElement("li");m.classList.add("image-desc-item"),m.innerHTML=`<p>Likes</p><p>${n.likes}</p>`;const h=document.createElement("li");h.classList.add("image-desc-item"),h.innerHTML=`<p>Views</p><p>${n.views}</p>`;const g=document.createElement("li");g.classList.add("image-desc-item"),g.innerHTML=`<p>Comments</p><p>${n.comments}</p>`;const u=document.createElement("li");u.classList.add("image-desc-item"),u.innerHTML=`<p>Downloads</p><p>${n.downloads}</p>`,i.appendChild(m),i.appendChild(h),i.appendChild(g),i.appendChild(u),e.appendChild(r),s.appendChild(e),s.appendChild(i),y.appendChild(s)}),o.refresh()}
//# sourceMappingURL=commonHelpers.js.map
