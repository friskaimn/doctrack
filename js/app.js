// State, render view, dan aksi UI
let tab='dash',flt='all',role='tw',nid=100;
const $=s=>document.querySelector(s);
const can=()=>role!=='pic',add=()=>role==='tw';
const stg=d=>(d.type==='BRD'?BRD:DS);
const wos_alert=w=>w.step<5&&left(w.end)<=7;
const lbl=n=>left(n)<0?`Lewat ${-left(n)} hari`:left(n)===0?'Hari ini':`${left(n)} hari lagi`;

function nav(){
  const t=[['dash','Dashboard'],['doc','Dokumen BRD & DS'],['wo','Tracking WO'],['nt','Notifikasi']];
  const n=wos.filter(wos_alert).length;
  $('#nav').innerHTML=t.map(([k,v])=>`<button class="${tab===k?'on':''}" onclick="go('${k}')">${v}${k==='nt'&&n?` <span class="tag r">${n}</span>`:''}</button>`).join('');
}
function go(t,f){tab=t;if(f)flt=f;render()}
function render(){nav();$('#main').innerHTML=({dash,doc,wo,nt})[tab]()}
const cnt=(type,s)=>docs.filter(d=>d.type===type&&(s===2?d.stage===2:d.stage===4)).length;

function dash(){
  const al=wos.filter(wos_alert).length;
  const c=(n,l,f,a)=>`<button class="card ${a?'al':''}" onclick="go('${f[0]}','${f[1]}')"><b>${n}</b><span>${l}</span></button>`;
  const soon=wos.filter(w=>w.step<5).sort((a,b)=>left(a.end)-left(b.end)).slice(0,4);
  return `<h2>BRD</h2><div class="grid">${c(cnt('BRD',2),'On review','doc','BRD')}${c(cnt('BRD',4),'On signing','doc','BRD')}${c(docs.filter(d=>d.type==='BRD'&&d.stage===5).length,'Fully signed','doc','BRD')}</div>
  <h2>DS</h2><div class="grid">${c(cnt('DS',2),'On review','doc','DS')}${c(cnt('DS',4),'On signing','doc','DS')}${c(docs.filter(d=>d.type==='DS'&&d.stage===5).length,'Fully signed','doc','DS')}</div>
  <h2>WO</h2><div class="grid">${c(wos.filter(w=>w.step>0&&w.step<4).length,'Draft & approval','wo','all')}${c(wos.filter(w=>w.step===3).length,'Diproses sekretaris','wo','all')}${c(wos.filter(w=>w.step===4).length,'On signing','wo','all')}${c(al,'Mendekati deadline (≤7 hari)','nt','all',al>0)}</div>
  <h2>Deadline WO terdekat</h2><div class="tw"><table><tbody>${soon.map(w=>`<tr onclick="openWO(${w.id})"><td>${w.no}</td><td>${w.proj}</td><td>${WOS[w.step]}</td><td><span class="tag ${left(w.end)<=7?'r':''}">${lbl(w.end)}</span></td></tr>`).join('')}</tbody></table></div>`;
}

function doc(){
  const L=docs.filter(d=>flt==='all'||d.type===flt);
  return `${can()?'':'<div class="ro">Mode baca saja: PIC NERPSP tidak dapat mengubah data.</div>'}
  <div class="bar"><select onchange="flt=this.value;render()">${['all','BRD','DS'].map(v=>`<option value="${v}" ${flt===v?'selected':''}>${v==='all'?'Semua jenis':v}</option>`).join('')}</select><span class="sp"></span>
  <button class="btn" ${add()?'':'disabled'} onclick="formDoc()">Tambah dokumen</button></div>
  <div class="tw"><table><thead><tr><th>Jenis</th><th>Projek</th><th>WO</th><th>Progres</th><th>Tahap</th><th>Feedback terbuka</th></tr></thead><tbody>
  ${L.map(d=>`<tr onclick="openDoc(${d.id})"><td><b>${d.type}</b></td><td>${d.proj}<br><span class="mu">PIC ${d.pic}</span></td><td>${d.wo}</td>
  <td><div class="dots">${[1,2,3,4,5].map(i=>`<i class="${i<=d.stage?'f':''}"></i>`).join('')}</div></td><td>${stg(d)[d.stage-1]}</td>
  <td>${d.fb.filter(f=>!f.done).length?`<span class="tag w">${d.fb.filter(f=>!f.done).length} perlu revisi</span>`:'-'}</td></tr>`).join('')}
  </tbody></table></div>`;
}

function wo(){
  return `${can()?'':'<div class="ro">Mode baca saja: PIC NERPSP tidak dapat mengubah data.</div>'}
  <div class="bar"><span class="sp"></span><button class="btn" ${add()?'':'disabled'} onclick="formWO()">Tambah WO</button></div>
  <div class="tw"><table><thead><tr><th>Nomor WO</th><th>Projek</th><th>Progres</th><th>Tahap</th><th>Batas WO</th></tr></thead><tbody>
  ${wos.map(w=>`<tr onclick="openWO(${w.id})"><td>${w.no}</td><td>${w.proj}<br><span class="mu">PIC ${w.pic}</span></td>
  <td><div class="dots">${WOS.map((_,i)=>`<i class="${i<=w.step?'f':''}" style="width:12px"></i>`).join('')}</div></td><td>${WOS[w.step]}</td>
  <td>${fmt(w.end)}<br>${w.step<5?`<span class="tag ${left(w.end)<=7?'r':left(w.end)<=14?'w':''}">${lbl(w.end)}</span>`:'<span class="tag o">Selesai</span>'}</td></tr>`).join('')}
  </tbody></table></div>`;
}

function nt(){
  const L=wos.filter(w=>w.step<5&&left(w.end)<=14).sort((a,b)=>left(a.end)-left(b.end));
  return `<h2>Reminder deadline WO</h2><p class="mu">Muncul otomatis saat batas WO tinggal 14 hari atau kurang dan WO belum terbit. Pada versi final, reminder juga dikirim lewat Outlook.</p>
  ${L.length?L.map(w=>`<div class="card" style="margin-bottom:8px;cursor:default;border-left:4px solid ${left(w.end)<=7?'var(--rd)':'var(--wa)'}"><div class="row" style="border:0"><div><b style="font-size:14px;display:inline">${w.no}</b> · ${w.proj}<br><span class="mu">Tahap: ${WOS[w.step]} · PIC ${w.pic}</span></div><div><span class="tag ${left(w.end)<=7?'r':'w'}">${lbl(w.end)}</span><br><button class="btn g" style="margin-top:6px" onclick="openWO(${w.id})">Buka</button></div></div></div>`).join(''):'<p>Tidak ada WO yang mendekati deadline.</p>'}`;
}

function show(h){$('#md').innerHTML=h;$('#ov').classList.add('on')}
function hide(){$('#ov').classList.remove('on');render()}
$('#ov').addEventListener('click',e=>{if(e.target.id==='ov')hide()});
$('#role').onchange=e=>{role=e.target.value;render()};
const stepper=(arr,cur)=>`<div class="stp">${arr.map((s,i)=>`<div class="${i<cur?'dn':i===cur?'cu':''}">${s}</div>`).join('')}</div>`;
const up=(o,k)=>`<div class="row"><span>${o.files.length?o.files.join(', '):'<span class="mu">Belum ada berkas</span>'}</span>${can()?`<label class="btn g" style="cursor:pointer">Unggah<input type="file" hidden onchange="${k}(${o.id},this)"></label>`:''}</div>`;

function openDoc(id){
  const d=docs.find(x=>x.id===id),s=stg(d);
  show(`<h3>${d.type} · ${d.proj}</h3><span class="mu">${d.wo} · PIC ${d.pic}</span>${stepper(s,d.stage-1)}
  <div class="bar">${can()?`<button class="btn" ${d.stage>=5?'disabled':''} onclick="adv(${id},1)">Lanjut ke: ${s[d.stage]||'-'}</button><button class="btn g" ${d.stage<=1?'disabled':''} onclick="adv(${id},-1)">Mundur</button>`:''}</div>
  ${d.stage===2?`<h2>Status review per tim</h2>${d.rev.map(([t,v],i)=>`<div class="row"><b>${t}</b><select ${can()?'':'disabled'} onchange="setRev(${id},${i},this.value)">${RS.map(r=>`<option ${r===v?'selected':''}>${r}</option>`).join('')}</select></div>`).join('')}`:''}
  <h2>Feedback dan revisi</h2>
  ${d.fb.length?d.fb.map((f,i)=>`<div class="fb"><b>${f.t}</b> <small>diterima ${fmt(f.d)}</small> <span class="tag ${f.done?'o':'w'}">${f.done?'Direvisi '+fmt(f.rd):'Perlu revisi'}</span><br>${f.x}${can()&&!f.done?` <button class="btn g" onclick="fbDone(${id},${i})">Tandai sudah direvisi</button>`:''}</div>`).join(''):'<p class="mu">Belum ada feedback.</p>'}
  ${can()?`<div class="fm"><div style="display:flex;gap:6px"><select id="ft">${TEAMS[d.type].map(t=>`<option>${t}</option>`).join('')}</select><input id="fx" placeholder="Isi feedback" style="flex:1"></div><button class="btn g" onclick="addFb(${id})">Catat feedback</button></div>`:''}
  <h2>Berkas</h2>${up(d,'upDoc')}
  <div class="mail">Link SharePoint review: sharepoint.example/nerps/${d.type}/${d.proj.replace(/ /g,'-')} (mockup)</div>
  <div class="bar" style="margin-top:14px">${add()?`<button class="btn d" onclick="delDoc(${id})">Hapus</button>`:''}<span class="sp"></span><button class="btn g" onclick="hide()">Tutup</button></div>`);
}
const adv=(id,n)=>{const d=docs.find(x=>x.id===id);d.stage+=n;openDoc(id)};
const setRev=(id,i,v)=>{docs.find(x=>x.id===id).rev[i][1]=v};
const fbDone=(id,i)=>{const f=docs.find(x=>x.id===id).fb[i];f.done=true;f.rd=dt(0);openDoc(id)};
const addFb=id=>{const x=$('#fx').value.trim();if(!x)return;docs.find(a=>a.id===id).fb.push({t:$('#ft').value,x,d:dt(0),done:false});openDoc(id)};
const upDoc=(id,el)=>{if(el.files[0]){docs.find(a=>a.id===id).files.push(el.files[0].name);openDoc(id)}};
const delDoc=id=>{if(confirm('Hapus dokumen ini?')){docs=docs.filter(x=>x.id!==id);hide()}};

function openWO(id){
  const w=wos.find(x=>x.id===id);
  show(`<h3>${w.no}</h3><span class="mu">${w.proj} · PIC ${w.pic} · batas ${fmt(w.end)}</span>
  <p>${w.step<5?`<span class="tag ${left(w.end)<=7?'r':'w'}">${lbl(w.end)}</span>`:'<span class="tag o">WO terbit</span>'}</p>${stepper(WOS,w.step)}
  <div class="bar">${can()?`<button class="btn" ${w.step>=5?'disabled':''} onclick="advWO(${id},1)">Lanjut: ${WOS[w.step+1]||'-'}</button>${w.step===2?`<button class="btn g" onclick="advWO(${id},-1)">PIC minta revisi</button>`:''}`:''}</div>
  <h2>Lampiran</h2>${up(w,'upWO')}
  ${can()?`<div class="mail"><b>Outlook (mockup)</b><br>Kirim update ke sekretaris: "Mohon proses WO ${w.proj}, lampiran terlampir."<br><button class="btn g" style="margin-top:6px" onclick="this.textContent='Terkirim (simulasi)'">Kirim email</button></div>`:''}
  <div class="bar" style="margin-top:14px">${add()?`<button class="btn d" onclick="if(confirm('Hapus WO?')){wos=wos.filter(x=>x.id!==${id});hide()}">Hapus</button>`:''}<span class="sp"></span><button class="btn g" onclick="hide()">Tutup</button></div>`);
}
const advWO=(id,n)=>{const w=wos.find(x=>x.id===id);w.step+=n;openWO(id)};
const upWO=(id,el)=>{if(el.files[0]){wos.find(a=>a.id===id).files.push(el.files[0].name);openWO(id)}};

function formDoc(){
  show(`<h3>Tambah dokumen</h3><div class="fm"><label>Jenis<select id="a1"><option>BRD</option><option>DS</option></select></label><label>Projek<input id="a2"></label><label>Nomor WO<input id="a3"></label><label>PIC<input id="a4"></label></div>
  <div class="bar" style="margin-top:14px"><button class="btn" onclick="saveDoc()">Simpan</button><button class="btn g" onclick="hide()">Batal</button></div>`);
}
function saveDoc(){const t=$('#a1').value;if(!$('#a2').value.trim())return;docs.push({id:++nid,type:t,proj:$('#a2').value,wo:$('#a3').value||'-',stage:1,pic:$('#a4').value||'-',files:[],rev:rv(TEAMS[t],[]),fb:[]});hide()}
function formWO(){
  show(`<h3>Tambah WO</h3><div class="fm"><label>Projek<input id="a1"></label><label>PIC NERPSP<input id="a2"></label><label>Batas WO<input id="a3" type="date" value="${dt(30)}"></label></div>
  <div class="bar" style="margin-top:14px"><button class="btn" onclick="saveWO()">Simpan</button><button class="btn g" onclick="hide()">Batal</button></div>`);
}
function saveWO(){if(!$('#a1').value.trim())return;wos.push({id:++nid,no:'(menunggu nomor)',proj:$('#a1').value,pic:$('#a2').value||'-',step:0,end:$('#a3').value,files:[]});hide()}
render();
