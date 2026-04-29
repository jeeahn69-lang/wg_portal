import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

/* ─────────────────────────────────────────────────────────────
   DESIGN TOKEN  (VYKINS-style: white bg / orange accent)
───────────────────────────────────────────────────────────── */
const C = {
  orange:  "#FF5A1F",
  orangeL: "#FFF0EB",
  orangeM: "#FFD0C0",
  text:    "#1A1A2E",
  sub:     "#8E8EA0",
  border:  "#F0F0F5",
  bg:      "#F8F8FC",
  white:   "#FFFFFF",
  green:   "#22C55E",
  red:     "#EF4444",
};

/* ─────────────────────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────────────────────── */
const Ic = ({ d, size = 18, color = "currentColor", fill = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? color : "none"} stroke={fill ? "none" : color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);
const ICONS = {
  dash:    "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  village: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
  sales:   "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  subsidy: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  board:   "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  bell:    "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
  search:  "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  plus:    "M12 4v16m8-8H4",
  close:   "M6 18L18 6M6 6l12 12",
  menu:    "M4 6h16M4 12h16M4 18h16",
  logout:  "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1",
  eye:     "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
  edit:    "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  trash:   "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  chat:    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  moon:    "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
  user:    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  up:      "M5 10l7-7m0 0l7 7m-7-7v18",
  down:    "M19 14l-7 7m0 0l-7-7m7 7V3",
  dot3:    "M5 12h.01M12 12h.01M19 12h.01",
};

/* ─────────────────────────────────────────────────────────────
   SAMPLE DATA
───────────────────────────────────────────────────────────── */
const monthlyData = [
  { m: "1월", income: 180, passive: 90 }, { m: "2월", income: 210, passive: 110 },
  { m: "3월", income: 240, passive: 120 }, { m: "4월", income: 190, passive: 100 },
  { m: "5월", income: 280, passive: 150 }, { m: "6월", income: 320, passive: 160 },
  { m: "7월", income: 400, passive: 200 }, { m: "8월", income: 290, passive: 140 },
  { m: "9월", income: 260, passive: 130 }, { m: "10월", income: 220, passive: 115 },
  { m: "11월", income: 240, passive: 125 }, { m: "12월", income: 300, passive: 155 },
];
const villages = [
  { id:1, name:"구이면 원기마을",  pop:142, area:"12.3km²", rep:"김철수", tel:"063-290-1234", status:"활성" },
  { id:2, name:"소양면 화심마을",  pop:98,  area:"8.7km²",  rep:"이영희", tel:"063-290-2345", status:"활성" },
  { id:3, name:"동상면 밀목마을",  pop:67,  area:"15.2km²", rep:"박민준", tel:"063-290-3456", status:"활성" },
  { id:4, name:"운주면 고당마을",  pop:203, area:"9.8km²",  rep:"최지원", tel:"063-290-4567", status:"점검중" },
  { id:5, name:"비봉면 내월마을",  pop:155, area:"11.1km²", rep:"정수연", tel:"063-290-5678", status:"활성" },
];
const salesData = [
  { id:1, company:"소양 두부마을기업",     month:"2025-04", sales:8420000,  prev:7800000,  cat:"농산물가공" },
  { id:2, company:"구이 친환경영농조합",   month:"2025-04", sales:12300000, prev:11500000, cat:"농산물유통" },
  { id:3, company:"동상 산촌체험마을",     month:"2025-04", sales:5600000,  prev:6100000,  cat:"체험관광" },
  { id:4, company:"완주 로컬푸드협동조합", month:"2025-04", sales:19800000, prev:18200000, cat:"로컬푸드" },
  { id:5, company:"운주 한옥펜션협동조합", month:"2025-04", sales:7100000,  prev:6900000,  cat:"숙박관광" },
];
const subsidies = [
  { id:1, name:"농촌활력 마을만들기사업",   amount:150000000, used:87000000,  period:"2025.01~12", status:"진행중" },
  { id:2, name:"마을기업 육성지원사업",     amount:80000000,  used:80000000,  period:"2024.03~12", status:"완료" },
  { id:3, name:"농어촌 빈집정비사업",       amount:50000000,  used:23000000,  period:"2025.02~11", status:"진행중" },
  { id:4, name:"귀농귀촌 정착지원사업",     amount:200000000, used:45000000,  period:"2025.01~12", status:"진행중" },
  { id:5, name:"스마트농촌 ICT 인프라구축", amount:300000000, used:0,         period:"2025.06~",   status:"예정" },
];
const posts = [
  { id:1, title:"2025년 마을공동체 활성화 사업 공고",  author:"담당자", date:"2025-04-28", views:234, cat:"공지" },
  { id:2, title:"봄 농촌체험 프로그램 참가자 모집",    author:"담당자", date:"2025-04-25", views:187, cat:"행사" },
  { id:3, title:"마을기업 네트워크 정기 회의 안내",    author:"담당자", date:"2025-04-22", views:95,  cat:"회의" },
  { id:4, title:"농촌관광 역량강화 교육 참가 안내",    author:"담당자", date:"2025-04-18", views:312, cat:"교육" },
  { id:5, title:"완주군 로컬푸드 직거래장터 운영 현황",author:"담당자", date:"2025-04-15", views:421, cat:"현황" },
  { id:6, title:"2분기 보조금 정산 제출 안내",        author:"담당자", date:"2025-04-10", views:156, cat:"공지" },
];
const recentTx = [
  { icon:"🏪", name:"소양 두부마을기업", sub:"매출 등록",    amt:"+₩8,420,000", color:C.green },
  { icon:"🌾", name:"구이 친환경영농조합",sub:"보조금 집행",  amt:"-₩2,300,000", color:C.red   },
  { icon:"🏡", name:"동상 산촌체험마을", sub:"수익 정산",    amt:"+₩5,600,000", color:C.green },
  { icon:"🛒", name:"완주 로컬푸드",     sub:"판매 완료",    amt:"+₩19,800,000",color:C.green },
];

const fmt = (n) => n.toLocaleString("ko-KR");
const pct = (u, t) => t > 0 ? Math.round((u / t) * 100) : 0;

/* ─────────────────────────────────────────────────────────────
   LOGIN PAGE
───────────────────────────────────────────────────────────── */
function LoginPage({ onLogin }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const go = () => { if (id === "admin" && pw === "1234") onLogin(); else setErr("아이디 또는 비밀번호가 올바르지 않습니다."); };
  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg, #FFF0EB 0%, #ffffff 50%, #FFF8F5 100%)`, display:"flex", alignItems:"center", justifyContent:"center", padding:16, fontFamily:"'Noto Sans KR', sans-serif" }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:64, height:64, background:C.orange, borderRadius:18, marginBottom:16, boxShadow:`0 8px 24px ${C.orangeM}` }}>
            <span style={{ fontSize:30 }}>🌿</span>
          </div>
          <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-0.5px" }}>완주군 마을포탈</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:4 }}>Wanju Village Management Portal</div>
        </div>
        {/* Card */}
        <div style={{ background:C.white, borderRadius:24, padding:36, boxShadow:"0 4px 40px rgba(0,0,0,0.08)", border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:24 }}>관리자 로그인</div>
          <div style={{ marginBottom:16 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.sub, display:"block", marginBottom:6 }}>아이디</label>
            <input value={id} onChange={e=>{setId(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="admin"
              style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px 16px", fontSize:14, color:C.text, outline:"none", boxSizing:"border-box", background:C.bg, transition:"border 0.2s" }}
              onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>
          <div style={{ marginBottom:8 }}>
            <label style={{ fontSize:12, fontWeight:600, color:C.sub, display:"block", marginBottom:6 }}>비밀번호</label>
            <input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"
              style={{ width:"100%", border:`1.5px solid ${C.border}`, borderRadius:12, padding:"12px 16px", fontSize:14, color:C.text, outline:"none", boxSizing:"border-box", background:C.bg }}
              onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>
          {err && <p style={{ fontSize:12, color:C.red, marginBottom:8 }}>{err}</p>}
          <button onClick={go} style={{ width:"100%", background:C.orange, color:"#fff", border:"none", borderRadius:12, padding:"14px", fontSize:15, fontWeight:700, cursor:"pointer", marginTop:8, boxShadow:`0 4px 16px ${C.orangeM}`, transition:"opacity 0.2s" }}
            onMouseOver={e=>e.target.style.opacity=0.9} onMouseOut={e=>e.target.style.opacity=1}>
            로그인
          </button>
          <p style={{ textAlign:"center", fontSize:12, color:C.sub, marginTop:20 }}>테스트 계정: <strong>admin</strong> / <strong>1234</strong></p>
        </div>
        <p style={{ textAlign:"center", fontSize:12, color:"#ccc", marginTop:24 }}>© 2025 완주군청 농촌활력과</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SIDEBAR
───────────────────────────────────────────────────────────── */
const NAV = [
  { key:"dashboard", label:"대시보드",      icon:ICONS.dash },
  { key:"village",   label:"마을정보관리",  icon:ICONS.village },
  { key:"sales",     label:"마을기업 매출", icon:ICONS.sales },
  { key:"subsidy",   label:"보조금사업관리",icon:ICONS.subsidy },
  { key:"board",     label:"게시판",        icon:ICONS.board },
];

function Sidebar({ active, tabs, onNav, onClose, mobile }) {
  return (
    <div style={{
      width: mobile ? "100%" : 220, height:"100%", background:C.white,
      borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column",
      padding:"20px 12px", boxSizing:"border-box", position: mobile ? "relative" : "sticky", top:0,
    }}>
      {/* Logo */}
      <div style={{ display:"flex", alignItems:"center", gap:10, padding:"0 8px", marginBottom:28 }}>
        <div style={{ width:36, height:36, background:C.orange, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:18 }}>🌿</div>
        <div>
          <div style={{ fontSize:14, fontWeight:800, color:C.text, lineHeight:1.2 }}>완주군</div>
          <div style={{ fontSize:10, color:C.sub }}>마을정보 포탈</div>
        </div>
        {mobile && (
          <button onClick={onClose} style={{ marginLeft:"auto", background:"none", border:"none", cursor:"pointer", color:C.sub }}>
            <Ic d={ICONS.close} size={20} />
          </button>
        )}
      </div>
      {/* Nav */}
      <nav style={{ flex:1 }}>
        {NAV.map(n => {
          const isOpen = tabs.some(t => t.key === n.key);
          const isActive = active === n.key;
          return (
            <button key={n.key} onClick={() => { onNav(n.key); onClose?.(); }}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:12,
                padding:"11px 14px", borderRadius:12, border:"none", cursor:"pointer",
                marginBottom:4, transition:"all 0.15s", position:"relative",
                background: isActive ? C.orangeL : "transparent",
                color: isActive ? C.orange : C.sub,
              }}>
              <Ic d={n.icon} size={18} color={isActive ? C.orange : C.sub} />
              <span style={{ fontSize:13.5, fontWeight: isActive ? 700 : 500 }}>{n.label}</span>
              {isOpen && !isActive && (
                <span style={{ marginLeft:"auto", width:6, height:6, borderRadius:"50%", background:C.orangeM }} />
              )}
            </button>
          );
        })}
      </nav>
      {/* Bottom icons */}
      <div style={{ borderTop:`1px solid ${C.border}`, paddingTop:16, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:36, height:36, background:C.orange, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <Ic d={ICONS.user} size={16} color="#fff" />
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text }}>관리자</div>
          <div style={{ fontSize:11, color:C.sub }}>admin@wanju.go.kr</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TAB BAR (PC)
───────────────────────────────────────────────────────────── */
function TabBar({ tabs, active, onSelect, onClose }) {
  const labels = { dashboard:"대시보드", village:"마을정보관리", sales:"마을기업 매출", subsidy:"보조금사업관리", board:"게시판" };
  const tabIcons = { dashboard:"🏠", village:"🏘️", sales:"💰", subsidy:"📋", board:"📢" };
  return (
    <div style={{ display:"flex", alignItems:"center", background:C.bg, borderBottom:`1px solid ${C.border}`, padding:"0 0 0 4px", overflowX:"auto", flexShrink:0, minHeight:40 }}>
      {tabs.map(t => (
        <div key={t.key} onClick={() => onSelect(t.key)}
          style={{
            display:"flex", alignItems:"center", gap:6, padding:"8px 14px",
            cursor:"pointer", borderBottom:`2px solid ${active === t.key ? C.orange : "transparent"}`,
            background: active === t.key ? C.white : "transparent",
            color: active === t.key ? C.orange : C.sub,
            fontSize:12.5, fontWeight: active === t.key ? 700 : 500,
            whiteSpace:"nowrap", transition:"all 0.15s", userSelect:"none",
          }}>
          <span>{tabIcons[t.key]}</span>
          <span>{labels[t.key]}</span>
          <button onClick={e => { e.stopPropagation(); onClose(t.key); }}
            style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, marginLeft:2, padding:"0 2px", borderRadius:4, display:"flex", alignItems:"center" }}>
            <Ic d={ICONS.close} size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOPBAR
───────────────────────────────────────────────────────────── */
function TopBar({ onMenuClick }) {
  return (
    <div style={{ height:56, background:C.white, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:12, flexShrink:0 }}>
      <button onClick={onMenuClick} style={{ background:"none", border:"none", cursor:"pointer", color:C.sub, display:"flex", padding:6 }} className="lg-hide">
        <Ic d={ICONS.menu} size={20} />
      </button>
      {/* Search */}
      <div style={{ flex:1, maxWidth:320, position:"relative" }}>
        <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.sub }}>
          <Ic d={ICONS.search} size={15} />
        </div>
        <input placeholder="Search anything..." style={{ width:"100%", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:50, padding:"8px 14px 8px 36px", fontSize:13, color:C.text, outline:"none", boxSizing:"border-box" }} />
      </div>
      {/* Actions */}
      <button style={{ background:C.text, color:"#fff", border:"none", borderRadius:10, padding:"8px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
        <Ic d={ICONS.plus} size={14} color="#fff" /> 등록
      </button>
      <button style={{ position:"relative", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:10, padding:8, cursor:"pointer", display:"flex" }}>
        <Ic d={ICONS.bell} size={18} color={C.sub} />
        <span style={{ position:"absolute", top:6, right:6, width:7, height:7, background:C.orange, borderRadius:"50%", border:"1.5px solid #fff" }} />
      </button>
      <button style={{ background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:10, padding:8, cursor:"pointer", display:"flex" }}>
        <Ic d={ICONS.chat} size={18} color={C.sub} />
      </button>
      <div style={{ width:34, height:34, borderRadius:50, background:`linear-gradient(135deg,${C.orange},#FF8C42)`, display:"flex", alignItems:"center", justifyContent:"center" }}>
        <Ic d={ICONS.user} size={16} color="#fff" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   DASHBOARD
───────────────────────────────────────────────────────────── */
function Dashboard() {
  const totalSales = salesData.reduce((s,d)=>s+d.sales,0);
  const totalBudget = subsidies.reduce((s,d)=>s+d.amount,0);
  const totalUsed = subsidies.reduce((s,d)=>s+d.used,0);
  const totalPop = villages.reduce((s,v)=>s+v.pop,0);

  const pieData = [{ value: totalUsed }, { value: totalBudget - totalUsed }];

  return (
    <div style={{ padding:"20px 20px 20px", overflowY:"auto", height:"100%" }}>
      {/* 상단 통계 + 카드 */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:20, marginBottom:20, alignItems:"start" }}>
        <div>
          {/* Balance Card */}
          <div style={{ background:`linear-gradient(135deg,#1A1A2E,#2D2D4E)`, borderRadius:20, padding:24, marginBottom:16, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", right:-20, top:-20, width:140, height:140, borderRadius:"50%", background:"rgba(255,90,31,0.15)" }} />
            <div style={{ position:"absolute", right:60, bottom:-30, width:100, height:100, borderRadius:"50%", background:"rgba(255,90,31,0.1)" }} />
            <div style={{ fontSize:12, color:"rgba(255,255,255,0.5)", marginBottom:8 }}>이번달 마을기업 총 매출</div>
            <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:8 }}>
              <span style={{ fontSize:36, fontWeight:800, color:"#fff" }}>₩{(totalSales/1e6).toFixed(1)}</span>
              <span style={{ fontSize:18, color:"rgba(255,255,255,0.5)", fontWeight:400 }}>백만원</span>
            </div>
            <div style={{ display:"inline-flex", alignItems:"center", gap:4, background:"rgba(34,197,94,0.2)", borderRadius:50, padding:"4px 10px" }}>
              <Ic d={ICONS.up} size={12} color={C.green} />
              <span style={{ fontSize:12, color:C.green, fontWeight:600 }}>+7.2% 전월 대비</span>
            </div>
            {/* Credit card visual */}
            <div style={{ position:"absolute", right:20, top:"50%", transform:"translateY(-50%)", width:100, height:64, background:`linear-gradient(135deg,${C.orange},#FF8C42,#FFB347)`, borderRadius:12, opacity:0.9, boxShadow:"0 8px 24px rgba(255,90,31,0.4)" }}>
              <div style={{ position:"absolute", bottom:10, left:10, width:20, height:14, border:"2px solid rgba(255,255,255,0.6)", borderRadius:3 }} />
              <div style={{ position:"absolute", top:10, right:10, fontSize:14 }}>🌿</div>
            </div>
          </div>

          {/* 4 stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:12 }}>
            {[
              { label:"등록 마을 수",  value:`${villages.length}개`,   sub:"완주군 전체", color:C.orange, bg:C.orangeL },
              { label:"총 주민 수",    value:`${fmt(totalPop)}명`,      sub:"5개 마을 합계", color:"#3B82F6", bg:"#EFF6FF" },
              { label:"보조금 집행률", value:`${pct(totalUsed,totalBudget)}%`, sub:`${(totalUsed/1e6).toFixed(0)}백만 집행`, color:"#8B5CF6", bg:"#F5F3FF" },
              { label:"게시물 수",     value:`${posts.length}건`,        sub:"이번달 등록", color:C.green, bg:"#F0FDF4" },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.white, borderRadius:16, padding:16, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:12, color:C.sub, marginBottom:8 }}>{s.label}</div>
                <div style={{ fontSize:22, fontWeight:800, color:C.text, marginBottom:4 }}>{s.value}</div>
                <div style={{ display:"inline-block", fontSize:11, color:s.color, background:s.bg, borderRadius:50, padding:"2px 8px", fontWeight:600 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ width:220, display:"flex", flexDirection:"column", gap:14 }}>
          {/* Recent Tx */}
          <div style={{ background:C.white, borderRadius:20, padding:16, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>최근 거래</span>
              <button style={{ background:"none", border:"none", cursor:"pointer", color:C.sub }}><Ic d={ICONS.dot3} size={16} /></button>
            </div>
            {recentTx.map((t,i)=>(
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, marginBottom: i<recentTx.length-1?12:0 }}>
                <div style={{ width:34, height:34, background:C.orangeL, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, flexShrink:0 }}>{t.icon}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:12, fontWeight:600, color:C.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{t.name}</div>
                  <div style={{ fontSize:11, color:C.sub }}>{t.sub}</div>
                </div>
                <div style={{ fontSize:12, fontWeight:700, color:t.color, shrink:0, whiteSpace:"nowrap" }}>{t.amt.split("₩")[1] ? `₩${(parseInt(t.amt.replace(/[^0-9]/g,""))/1e6).toFixed(1)}M` : t.amt}</div>
              </div>
            ))}
          </div>
          {/* Total Savings / Budget */}
          <div style={{ background:C.white, borderRadius:20, padding:16, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
              <span style={{ fontSize:13, fontWeight:700, color:C.text }}>보조금 집행 현황</span>
              <button style={{ background:"none", border:"none", cursor:"pointer", color:C.sub }}><Ic d={ICONS.dot3} size={16} /></button>
            </div>
            <div style={{ position:"relative", width:100, height:100, margin:"0 auto 12px" }}>
              <PieChart width={100} height={100}>
                <Pie data={pieData} cx={45} cy={45} innerRadius={32} outerRadius={45} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  <Cell fill={C.orange} />
                  <Cell fill={C.orangeL} />
                </Pie>
              </PieChart>
              <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
                <span style={{ fontSize:13, fontWeight:800, color:C.text }}>{pct(totalUsed,totalBudget)}%</span>
              </div>
            </div>
            <div style={{ fontSize:11, color:C.sub, textAlign:"center", marginBottom:10 }}>전월 대비 집행률 상승 <span style={{ color:C.green, fontWeight:700 }}>+5%</span></div>
            <div style={{ background:C.bg, borderRadius:10, padding:"8px 12px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:11, color:C.sub }}>총 예산</span>
              <span style={{ fontSize:13, fontWeight:800, color:C.text }}>₩{(totalBudget/1e8).toFixed(1)}억</span>
              <span style={{ fontSize:11, color:C.green, fontWeight:600, background:"#F0FDF4", borderRadius:50, padding:"2px 6px" }}>+9%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Money Flow Chart */}
      <div style={{ background:C.white, borderRadius:20, padding:24, border:`1px solid ${C.border}`, marginBottom:16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div>
            <div style={{ fontSize:15, fontWeight:700, color:C.text }}>마을기업 매출 흐름</div>
            <div style={{ display:"flex", gap:16, marginTop:6 }}>
              <span style={{ fontSize:11, color:C.sub, display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:20, height:8, background:C.orange, borderRadius:2, display:"inline-block" }} /> 직접 매출
              </span>
              <span style={{ fontSize:11, color:C.sub, display:"flex", alignItems:"center", gap:4 }}>
                <span style={{ width:20, height:8, background:C.orangeM, borderRadius:2, display:"inline-block" }} /> 간접 수익
              </span>
            </div>
          </div>
          <select style={{ border:`1.5px solid ${C.border}`, borderRadius:10, padding:"6px 12px", fontSize:12, color:C.text, background:C.bg, cursor:"pointer" }}>
            <option>월별</option><option>분기별</option><option>연간</option>
          </select>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={monthlyData} barSize={16} barGap={4}>
            <XAxis dataKey="m" tick={{ fontSize:11, fill:C.sub }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize:11, fill:C.sub }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}M`} />
            <Tooltip formatter={(v,n)=>[`${v}백만원`, n==="income"?"직접 매출":"간접 수익"]} contentStyle={{ borderRadius:10, border:`1px solid ${C.border}`, fontSize:12 }} />
            <Bar dataKey="income" radius={[6,6,0,0]}>
              {monthlyData.map((m,i)=>(
                <Cell key={i} fill={i===6 ? C.orange : C.orangeM} />
              ))}
            </Bar>
            <Bar dataKey="passive" radius={[6,6,0,0]}>
              {monthlyData.map((m,i)=>(
                <Cell key={i} fill={i===6 ? "#FF8C42" : "#FFE8D6"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        {/* 최근 게시물 */}
        <div style={{ background:C.white, borderRadius:20, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>최근 게시물</div>
          {posts.slice(0,4).map((p,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom: i<3 ? `1px solid ${C.border}` : "none" }}>
              <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:50, background: p.cat==="공지"?"#FEE2E2":p.cat==="행사"?"#FEF9C3":"#F1F5F9", color: p.cat==="공지"?"#DC2626":p.cat==="행사"?"#B45309":"#64748B" }}>{p.cat}</span>
              <span style={{ fontSize:12, color:C.text, flex:1, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{p.title}</span>
              <span style={{ fontSize:11, color:C.sub, shrink:0, whiteSpace:"nowrap" }}>{p.date.slice(5)}</span>
            </div>
          ))}
        </div>
        {/* 보조금 현황 */}
        <div style={{ background:C.white, borderRadius:20, padding:20, border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:13, fontWeight:700, color:C.text, marginBottom:14 }}>보조금사업 현황</div>
          {subsidies.slice(0,4).map((s,i)=>{
            const rate = pct(s.used, s.amount);
            return (
              <div key={i} style={{ marginBottom: i<3?14:0 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
                  <span style={{ fontSize:12, color:C.text, fontWeight:500 }}>{s.name.substring(0,12)}...</span>
                  <span style={{ fontSize:12, fontWeight:700, color: s.status==="완료"?C.green:s.status==="예정"?C.sub:C.orange }}>{rate}%</span>
                </div>
                <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                  <div style={{ height:"100%", width:`${rate}%`, background: s.status==="완료"?C.green:s.status==="예정"?"#CBD5E1":C.orange, borderRadius:3, transition:"width 0.4s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   VILLAGE PAGE
───────────────────────────────────────────────────────────── */
function VillagePage() {
  const [q, setQ] = useState("");
  const list = villages.filter(v=>v.name.includes(q));
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <div style={{ display:"flex", gap:12, marginBottom:20, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ position:"relative", flex:1, minWidth:200 }}>
          <div style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color:C.sub }}><Ic d={ICONS.search} size={15}/></div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="마을명 검색..." style={{ width:"100%", boxSizing:"border-box", background:C.bg, border:`1.5px solid ${C.border}`, borderRadius:50, padding:"9px 14px 9px 36px", fontSize:13, outline:"none" }} />
        </div>
        <button style={{ background:C.orange, color:"#fff", border:"none", borderRadius:12, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <Ic d={ICONS.plus} size={15} color="#fff"/> 마을 등록
        </button>
      </div>
      {/* Table */}
      <div style={{ background:C.white, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
            <thead>
              <tr style={{ background:C.bg }}>
                {["번호","마을명","인구","면적","대표자","연락처","상태","관리"].map(h=>(
                  <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.sub, whiteSpace:"nowrap", borderBottom:`1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((v,i)=>(
                <tr key={v.id} style={{ borderBottom:`1px solid ${C.border}`, transition:"background 0.15s" }}
                  onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"14px 16px", fontSize:13, color:C.sub }}>{v.id}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, fontWeight:700, color:C.text }}>{v.name}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:C.text }}>{v.pop}명</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:C.text }}>{v.area}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:C.text }}>{v.rep}</td>
                  <td style={{ padding:"14px 16px", fontSize:13, color:C.sub }}>{v.tel}</td>
                  <td style={{ padding:"14px 16px" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:50, background:v.status==="활성"?"#F0FDF4":"#FFFBEB", color:v.status==="활성"?C.green:"#D97706" }}>{v.status}</span>
                  </td>
                  <td style={{ padding:"14px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={{ background:C.orangeL, border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer", color:C.orange }}><Ic d={ICONS.edit} size={13} color={C.orange}/></button>
                      <button style={{ background:"#FEE2E2", border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer" }}><Ic d={ICONS.trash} size={13} color="#EF4444"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SALES PAGE
───────────────────────────────────────────────────────────── */
function SalesPage() {
  const total = salesData.reduce((s,d)=>s+d.sales,0);
  const prevT = salesData.reduce((s,d)=>s+d.prev,0);
  const gr = (((total-prevT)/prevT)*100).toFixed(1);
  const chartData = salesData.map(d=>({ name:d.company.substring(0,6), sales:Math.round(d.sales/1e6), prev:Math.round(d.prev/1e6) }));
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, marginBottom:20 }}>
        {[
          { label:"이번달 총 매출", value:`₩${(total/1e6).toFixed(1)}M`, sub:`+${gr}% 성장`, c:C.orange },
          { label:"등록 마을기업", value:`${salesData.length}개`, sub:"2025년 기준", c:"#3B82F6" },
          { label:"기업당 평균", value:`₩${(total/salesData.length/1e6).toFixed(1)}M`, sub:"월 평균 매출", c:"#8B5CF6" },
        ].map((s,i)=>(
          <div key={i} style={{ background:C.white, borderRadius:16, padding:18, border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.sub }}>{s.label}</div>
            <div style={{ fontSize:22, fontWeight:800, color:s.c, margin:"6px 0 4px" }}>{s.value}</div>
            <div style={{ fontSize:11, color:C.sub }}>{s.sub}</div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div style={{ background:C.white, borderRadius:20, padding:20, border:`1px solid ${C.border}`, marginBottom:16 }}>
        <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:14 }}>기업별 매출 비교</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={20}>
            <XAxis dataKey="name" tick={{ fontSize:11, fill:C.sub }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11, fill:C.sub }} axisLine={false} tickLine={false} tickFormatter={v=>`${v}M`}/>
            <Tooltip formatter={(v)=>[`₩${v}백만원`]} contentStyle={{ borderRadius:10, border:`1px solid ${C.border}`, fontSize:12 }}/>
            <Bar dataKey="sales" name="이번달" fill={C.orange} radius={[6,6,0,0]}/>
            <Bar dataKey="prev"  name="전월"   fill={C.orangeM} radius={[6,6,0,0]}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Table */}
      <div style={{ background:C.white, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden" }}>
        <div style={{ padding:"16px 20px", borderBottom:`1px solid ${C.border}`, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontSize:14, fontWeight:700, color:C.text }}>기업별 매출 상세</span>
          <button style={{ background:C.orangeL, color:C.orange, border:"none", borderRadius:10, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>+ 매출 등록</button>
        </div>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
            <thead><tr style={{ background:C.bg }}>
              {["기업명","업종","이번달 매출","전월 매출","증감율"].map(h=>(
                <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.sub, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {salesData.map(d=>{
                const diff=d.sales-d.prev, rate=((diff/d.prev)*100).toFixed(1);
                return (
                  <tr key={d.id} style={{ borderBottom:`1px solid ${C.border}` }}
                    onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:C.text }}>{d.company}</td>
                    <td style={{ padding:"12px 16px" }}><span style={{ fontSize:11, background:C.orangeL, color:C.orange, borderRadius:50, padding:"3px 10px", fontWeight:700 }}>{d.cat}</span></td>
                    <td style={{ padding:"12px 16px", fontSize:13, fontWeight:700, color:C.text }}>₩{fmt(d.sales)}</td>
                    <td style={{ padding:"12px 16px", fontSize:13, color:C.sub }}>₩{fmt(d.prev)}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:13, fontWeight:700, color:diff>=0?C.green:C.red, display:"flex", alignItems:"center", gap:3 }}>
                        <Ic d={diff>=0?ICONS.up:ICONS.down} size={12} color={diff>=0?C.green:C.red}/> {Math.abs(rate)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBSIDY PAGE
───────────────────────────────────────────────────────────── */
function SubsidyPage() {
  const totalB = subsidies.reduce((s,d)=>s+d.amount,0);
  const totalU = subsidies.reduce((s,d)=>s+d.used,0);
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,${C.orange},#FF8C42)`, borderRadius:20, padding:24, marginBottom:20, color:"#fff", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", right:-30, top:-30, width:160, height:160, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ fontSize:12, opacity:0.8, marginBottom:6 }}>2025년 총 보조금 예산</div>
        <div style={{ fontSize:32, fontWeight:800, marginBottom:12 }}>₩{(totalB/1e8).toFixed(1)}억원</div>
        <div style={{ height:8, background:"rgba(255,255,255,0.25)", borderRadius:4, overflow:"hidden", marginBottom:8 }}>
          <div style={{ height:"100%", width:`${pct(totalU,totalB)}%`, background:"#fff", borderRadius:4 }}/>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, opacity:0.9 }}>
          <span>집행: ₩{(totalU/1e8).toFixed(1)}억</span>
          <span style={{ fontWeight:700 }}>{pct(totalU,totalB)}% 집행</span>
        </div>
      </div>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <button style={{ background:C.orange, color:"#fff", border:"none", borderRadius:12, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <Ic d={ICONS.plus} size={15} color="#fff"/> 사업 등록
        </button>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        {subsidies.map(s=>{
          const rate=pct(s.used,s.amount);
          const statusStyle = s.status==="완료" ? { bg:"#F0FDF4",color:C.green } : s.status==="예정" ? { bg:"#F1F5F9",color:C.sub } : { bg:C.orangeL,color:C.orange };
          return (
            <div key={s.id} style={{ background:C.white, borderRadius:20, padding:20, border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:3 }}>{s.name}</div>
                  <div style={{ fontSize:11, color:C.sub }}>{s.period}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <span style={{ fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:50, background:statusStyle.bg, color:statusStyle.color }}>{s.status}</span>
                  <button style={{ background:C.orangeL, border:"none", borderRadius:8, padding:"6px 8px", cursor:"pointer" }}><Ic d={ICONS.edit} size={13} color={C.orange}/></button>
                </div>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:12 }}>
                {[
                  { l:"예산",color:C.text, v:`${(s.amount/1e6).toFixed(0)}M` },
                  { l:"집행",color:"#3B82F6", v:`${(s.used/1e6).toFixed(0)}M` },
                  { l:"잔액",color:C.green, v:`${((s.amount-s.used)/1e6).toFixed(0)}M` },
                ].map((x,i)=>(
                  <div key={i} style={{ background:C.bg, borderRadius:12, padding:"10px 14px", textAlign:"center" }}>
                    <div style={{ fontSize:10, color:C.sub, marginBottom:3 }}>{x.l}</div>
                    <div style={{ fontSize:14, fontWeight:800, color:x.color }}>₩{x.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${rate}%`, background: s.status==="완료"?C.green:s.status==="예정"?"#CBD5E1":C.orange, borderRadius:3 }}/>
              </div>
              <div style={{ textAlign:"right", fontSize:11, color:C.sub, marginTop:4 }}>{rate}% 집행</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   BOARD PAGE
───────────────────────────────────────────────────────────── */
function BoardPage() {
  const [filter, setFilter] = useState("전체");
  const cats = ["전체","공지","행사","회의","교육","현황"];
  const filtered = filter==="전체" ? posts : posts.filter(p=>p.cat===filter);
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{ padding:"7px 14px", borderRadius:50, border:`1.5px solid ${filter===c?C.orange:C.border}`, background:filter===c?C.orange:"#fff", color:filter===c?"#fff":C.sub, fontSize:12, fontWeight:600, cursor:"pointer", transition:"all 0.15s" }}>{c}</button>
          ))}
        </div>
        <button style={{ background:C.orange, color:"#fff", border:"none", borderRadius:12, padding:"9px 18px", fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <Ic d={ICONS.plus} size={15} color="#fff"/> 글쓰기
        </button>
      </div>
      <div style={{ background:C.white, borderRadius:20, border:`1px solid ${C.border}`, overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:500 }}>
            <thead><tr style={{ background:C.bg }}>
              {["번호","분류","제목","작성일","조회","관리"].map(h=>(
                <th key={h} style={{ padding:"12px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:C.sub, borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(p=>(
                <tr key={p.id} style={{ borderBottom:`1px solid ${C.border}`, cursor:"pointer" }}
                  onMouseOver={e=>e.currentTarget.style.background=C.bg} onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 16px", fontSize:13, color:C.sub }}>{p.id}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:50, background:p.cat==="공지"?"#FEE2E2":p.cat==="행사"?"#FEF9C3":"#F1F5F9", color:p.cat==="공지"?"#DC2626":p.cat==="행사"?"#B45309":"#64748B" }}>{p.cat}</span>
                  </td>
                  <td style={{ padding:"13px 16px", fontSize:13, fontWeight:600, color:C.text, maxWidth:260, overflow:"hidden", whiteSpace:"nowrap", textOverflow:"ellipsis" }}>{p.title}</td>
                  <td style={{ padding:"13px 16px", fontSize:12, color:C.sub, whiteSpace:"nowrap" }}>{p.date}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:12, color:C.sub, display:"flex", alignItems:"center", gap:3 }}>
                      <Ic d={ICONS.eye} size={13}/>{p.views}
                    </span>
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex", gap:6 }}>
                      <button style={{ background:C.orangeL, border:"none", borderRadius:8, padding:"5px 7px", cursor:"pointer" }}><Ic d={ICONS.edit} size={12} color={C.orange}/></button>
                      <button style={{ background:"#FEE2E2", border:"none", borderRadius:8, padding:"5px 7px", cursor:"pointer" }}><Ic d={ICONS.trash} size={12} color="#EF4444"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ padding:16, display:"flex", justifyContent:"center", gap:6 }}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} style={{ width:32, height:32, borderRadius:8, border:`1.5px solid ${n===1?C.orange:C.border}`, background:n===1?C.orange:"#fff", color:n===1?"#fff":C.sub, fontSize:13, fontWeight:600, cursor:"pointer" }}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────────────────────── */
const PAGE_COMPONENTS = { dashboard:<Dashboard/>, village:<VillagePage/>, sales:<SalesPage/>, subsidy:<SubsidyPage/>, board:<BoardPage/> };

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [tabs, setTabs] = useState([{ key:"dashboard" }]);
  const [active, setActive] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  const openTab = (key) => {
    if (!tabs.find(t=>t.key===key)) setTabs(prev=>[...prev, { key }]);
    setActive(key);
  };
  const closeTab = (key) => {
    const next = tabs.filter(t=>t.key!==key);
    if (next.length===0) { setTabs([{ key:"dashboard" }]); setActive("dashboard"); return; }
    setTabs(next);
    if (active===key) setActive(next[next.length-1].key);
  };

  if (!loggedIn) return <LoginPage onLogin={()=>setLoggedIn(true)}/>;

  /* ── MOBILE ── */
  if (isMobile) {
    const mobileNav = NAV.map(n=>({ ...n }));
    return (
      <div style={{ display:"flex", flexDirection:"column", height:"100vh", fontFamily:"'Noto Sans KR', sans-serif", background:C.bg }}>
        {/* Header */}
        <div style={{ background:C.white, borderBottom:`1px solid ${C.border}`, padding:"0 16px", height:52, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:30, height:30, background:C.orange, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>🌿</div>
            <span style={{ fontSize:15, fontWeight:800, color:C.text }}>완주군 포탈</span>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button style={{ background:"none", border:"none", cursor:"pointer", position:"relative", padding:4 }}>
              <Ic d={ICONS.bell} size={20} color={C.sub}/>
              <span style={{ position:"absolute", top:2, right:2, width:7, height:7, background:C.orange, borderRadius:"50%" }}/>
            </button>
            <button onClick={()=>setLoggedIn(false)} style={{ background:"none", border:"none", cursor:"pointer", padding:4 }}>
              <Ic d={ICONS.logout} size={18} color={C.sub}/>
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex:1, overflowY:"auto" }}>
          {PAGE_COMPONENTS[active]}
        </div>
        {/* Bottom Nav */}
        <div style={{ background:C.white, borderTop:`1px solid ${C.border}`, display:"flex", padding:"6px 0 10px", flexShrink:0 }}>
          {mobileNav.map(n=>(
            <button key={n.key} onClick={()=>setActive(n.key)} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:3, border:"none", background:"none", cursor:"pointer", padding:"4px 2px" }}>
              <div style={{ width:36, height:36, borderRadius:12, background:active===n.key?C.orangeL:"transparent", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s" }}>
                <Ic d={n.icon} size={18} color={active===n.key?C.orange:C.sub}/>
              </div>
              <span style={{ fontSize:9, fontWeight:active===n.key?700:500, color:active===n.key?C.orange:C.sub }}>{n.label.length>5?n.label.slice(0,5)+"…":n.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ── PC ── */
  return (
    <div style={{ display:"flex", height:"100vh", fontFamily:"'Noto Sans KR', sans-serif", background:C.bg, overflow:"hidden" }}>
      {/* Sidebar */}
      <Sidebar active={active} tabs={tabs} onNav={openTab} />
      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <TopBar onMenuClick={()=>{}} />
        {/* Tab Bar */}
        <TabBar tabs={tabs} active={active} onSelect={setActive} onClose={closeTab} />
        {/* Page Content */}
        <div style={{ flex:1, overflow:"hidden", background:C.bg }}>
          {tabs.map(t=>(
            <div key={t.key} style={{ height:"100%", display: active===t.key ? "block" : "none" }}>
              {PAGE_COMPONENTS[t.key]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
