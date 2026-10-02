'use client';
import {useState} from 'react';
const media=[['/design/tener-gallery.webp','Concept illustration'],['/design/tener-container.webp','Container concept illustration'],['/design/tener-hero.webp','Energy storage site concept illustration']];
export function ProductMedia({label}:{label:string}){
 const [active,setActive]=useState(0);
 return <div className="reference-gallery"><figure><img src={media[active][0]} alt={media[active][1]} width="795" height="270"/><figcaption>{label}</figcaption></figure><div className="media-thumbnails">{media.map(([src,alt],i)=><button key={src} type="button" aria-label={alt} aria-pressed={i===active} onClick={()=>setActive(i)}><img src={src} alt="" width="120" height="80"/></button>)}</div></div>;
}
