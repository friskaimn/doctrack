// Konstanta alur, helper tanggal, dan data contoh (ganti dengan API/database di versi final)
const BRD=['User finalisasi BRD','Review tim BR, NERPSP, ITAG, ECS, EDM','BRD approved','Signing dokumen','Selesai, fully signed'];
const DS=['Tim NERPSP final drafting','Review tim ITAG, ECS, EDM','DS approved','Signing dokumen','Selesai, fully signed'];
const WOS=['Request WO ke sekretaris','Sekretaris drafting WO','Approval PIC NERPSP','Sekretaris memproses WO','WO on signing','WO terbit'];
const TEAMS={BRD:['BR','NERPSP','ITAG','ECS','EDM'],DS:['ITAG','ECS','EDM']};
const RS=['Belum','Review','Ada feedback','Revisi selesai','OK'];
const today=new Date();today.setHours(0,0,0,0);
const dt=n=>{const x=new Date(today);x.setDate(x.getDate()+n);return x.toISOString().slice(0,10)};
const left=s=>Math.round((new Date(s)-today)/864e5);
const fmt=s=>new Date(s).toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});
const rv=(t,a)=>t.map((x,i)=>[x,a[i]||'Belum']);
let docs=[
{id:1,type:'BRD',proj:'Billing Revamp',wo:'WO-2611-014',stage:2,pic:'Rina',files:['BRD_Billing_v3.docx'],rev:rv(TEAMS.BRD,['OK','OK','Ada feedback','Review','Review']),fb:[{t:'ITAG',x:'Perjelas batas integrasi API pelanggan',d:dt(-4),done:false}]},
{id:2,type:'BRD',proj:'Portal Mitra',wo:'WO-2611-009',stage:4,pic:'Dimas',files:['BRD_Portal_v2.docx'],rev:rv(TEAMS.BRD,['OK','OK','OK','OK','OK']),fb:[]},
{id:3,type:'DS',proj:'Billing Revamp',wo:'WO-2611-014',stage:2,pic:'Rina',files:['DS_Billing_v1.docx'],rev:rv(TEAMS.DS,['Ada feedback','Review','Belum']),fb:[{t:'ITAG',x:'Tambahkan sequence diagram settlement',d:dt(-6),done:true,rd:dt(-3)},{t:'ITAG',x:'Update tabel field mapping',d:dt(-2),done:false}]},
{id:4,type:'DS',proj:'Inventory Sync',wo:'WO-2610-021',stage:4,pic:'Bagus',files:['DS_Inventory_v2.docx'],rev:rv(TEAMS.DS,['OK','OK','OK']),fb:[]},
{id:5,type:'DS',proj:'Portal Mitra',wo:'WO-2611-009',stage:1,pic:'Dimas',files:[],rev:rv(TEAMS.DS,[]),fb:[]}];
let wos=[
{id:1,no:'WO-2611-014',proj:'Billing Revamp',pic:'Rina',step:2,end:dt(5),files:['Lampiran_Billing.pdf']},
{id:2,no:'WO-2611-009',proj:'Portal Mitra',pic:'Dimas',step:4,end:dt(12),files:[]},
{id:3,no:'(menunggu nomor)',proj:'CRM Lite',pic:'Sari',step:0,end:dt(30),files:[]},
{id:4,no:'WO-2610-021',proj:'Inventory Sync',pic:'Bagus',step:3,end:dt(-1),files:[]},
{id:5,no:'WO-2609-030',proj:'Data Archive',pic:'Sari',step:5,end:dt(-20),files:[]}];
