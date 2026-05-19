import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════ */
const C = {
  orange:"#FF5A1F", orangeL:"#FFF0EB", orangeM:"#FFD0C0",
  text:"#1A1A2E", sub:"#8E8EA0", border:"#F0F0F5",
  bg:"#F8F8FC", white:"#FFFFFF",
  green:"#22C55E", red:"#EF4444", blue:"#3B82F6",
};

/* ═══════════════════════════════════════════════════════════════
   SUPABASE REST CLIENT  (SDK 없이 fetch 직접 사용)
═══════════════════════════════════════════════════════════════ */
function createSupabase(url, key) {
  const headers = {
    "apikey": key,
    "Authorization": `Bearer ${key}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation",
  };
  const base = `${url}/rest/v1`;

  return {
    url, key,
    async select(table, { columns = "*", filters = "", order = "" } = {}) {
      let q = `${base}/${table}?select=${columns}`;
      if (filters) q += `&${filters}`;
      if (order)   q += `&order=${order}`;
      const r = await fetch(q, { headers });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    async insert(table, data) {
      const r = await fetch(`${base}/${table}`, {
        method: "POST", headers,
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    async update(table, id, data) {
      const r = await fetch(`${base}/${table}?id=eq.${id}`, {
        method: "PATCH", headers,
        body: JSON.stringify(data),
      });
      if (!r.ok) throw new Error(await r.text());
      return r.json();
    },
    async delete(table, id) {
      const r = await fetch(`${base}/${table}?id=eq.${id}`, {
        method: "DELETE", headers,
      });
      if (!r.ok) throw new Error(await r.text());
      return true;
    },
  };
}

/* ═══════════════════════════════════════════════════════════════
   SQL SCHEMA  (Supabase에서 실행할 DDL)
═══════════════════════════════════════════════════════════════ */
const SQL_SCHEMA = `-- 마을정보 테이블
CREATE TABLE villages (
  id          bigserial PRIMARY KEY,
  name        text NOT NULL,
  population  integer DEFAULT 0,
  area        text,
  representative text,
  phone       text,
  status      text DEFAULT '활성',
  created_at  timestamptz DEFAULT now()
);

-- 마을기업 매출 테이블
CREATE TABLE sales (
  id           bigserial PRIMARY KEY,
  company_name text NOT NULL,
  category     text,
  month        text,
  sales_amount bigint DEFAULT 0,
  prev_amount  bigint DEFAULT 0,
  created_at   timestamptz DEFAULT now()
);

-- 보조금사업 테이블
CREATE TABLE subsidies (
  id           bigserial PRIMARY KEY,
  name         text NOT NULL,
  total_amount bigint DEFAULT 0,
  used_amount  bigint DEFAULT 0,
  period       text,
  status       text DEFAULT '진행중',
  created_at   timestamptz DEFAULT now()
);

-- 게시판 테이블
CREATE TABLE posts (
  id         bigserial PRIMARY KEY,
  title      text NOT NULL,
  author     text DEFAULT '담당자',
  category   text DEFAULT '공지',
  content    text,
  views      integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Row Level Security (공개 읽기/쓰기 허용 - 실서비스는 정책 필요)
ALTER TABLE villages  ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales     ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsidies ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_all" ON villages  FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON sales     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON subsidies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON posts     FOR ALL USING (true) WITH CHECK (true);`;

/* ═══════════════════════════════════════════════════════════════
   ICON
═══════════════════════════════════════════════════════════════ */
const Ic = ({ d, size = 18, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const I = {
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
  copy:    "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z",
  check:   "M5 13l4 4L19 7",
  info:    "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  db:      "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
  up:      "M5 10l7-7m0 0l7 7m-7-7v18",
  down:    "M19 14l-7 7m0 0l-7-7m7 7V3",
  dot3:    "M5 12h.01M12 12h.01M19 12h.01",
  user:    "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  chat:    "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
};

/* ═══════════════════════════════════════════════════════════════
   UTILITIES
═══════════════════════════════════════════════════════════════ */
const fmt     = (n) => (n || 0).toLocaleString("ko-KR");
const pct     = (u, t) => t > 0 ? Math.round((u / t) * 100) : 0;
const fmtM    = (n) => `₩${((n||0)/1e6).toFixed(1)}M`;

/* ═══════════════════════════════════════════════════════════════
   TOAST
═══════════════════════════════════════════════════════════════ */
function Toast({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:9999, display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type==="error" ? "#FEE2E2" : t.type==="warn" ? "#FEF9C3" : "#F0FDF4",
          border: `1px solid ${t.type==="error" ? "#FCA5A5" : t.type==="warn" ? "#FDE68A" : "#86EFAC"}`,
          borderRadius:12, padding:"12px 18px", fontSize:13, fontWeight:600,
          color: t.type==="error" ? C.red : t.type==="warn" ? "#B45309" : "#15803D",
          display:"flex", alignItems:"center", gap:8, boxShadow:"0 4px 16px rgba(0,0,0,0.08)",
          animation:"slideIn 0.25s ease",
        }}>
          <Ic d={t.type==="error" ? I.close : I.check} size={15} color={t.type==="error" ? C.red : "#15803D"}/>
          {t.msg}
        </div>
      ))}
    </div>
  );
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = useCallback((msg, type="success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, show };
}

/* ═══════════════════════════════════════════════════════════════
   MODAL WRAPPER
═══════════════════════════════════════════════════════════════ */
function Modal({ open, onClose, title, children, width = 480 }) {
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [onClose]);
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.4)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16, backdropFilter:"blur(2px)" }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:C.white, borderRadius:24, width:"100%", maxWidth:width, maxHeight:"90vh", overflowY:"auto", boxShadow:"0 20px 60px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"20px 24px 16px", borderBottom:`1px solid ${C.border}` }}>
          <span style={{ fontSize:16, fontWeight:800, color:C.text }}>{title}</span>
          <button onClick={onClose} style={{ background:C.bg, border:"none", borderRadius:8, padding:8, cursor:"pointer", display:"flex" }}>
            <Ic d={I.close} size={16} color={C.sub}/>
          </button>
        </div>
        <div style={{ padding:24 }}>{children}</div>
      </div>
    </div>
  );
}

/* ─ Field ─ */
const Field = ({ label, children, required }) => (
  <div style={{ marginBottom:16 }}>
    <label style={{ fontSize:12, fontWeight:700, color:C.sub, display:"block", marginBottom:6 }}>
      {label}{required && <span style={{ color:C.orange }}> *</span>}
    </label>
    {children}
  </div>
);
const inputStyle = {
  width:"100%", boxSizing:"border-box", border:`1.5px solid ${C.border}`,
  borderRadius:10, padding:"10px 14px", fontSize:13, color:C.text,
  outline:"none", background:C.bg, transition:"border 0.2s",
};
const Input = ({ ...p }) => (
  <input {...p} style={inputStyle}
    onFocus={e=>e.target.style.borderColor=C.orange}
    onBlur={e=>e.target.style.borderColor=C.border} />
);
const Select = ({ children, ...p }) => (
  <select {...p} style={{ ...inputStyle, cursor:"pointer" }}
    onFocus={e=>e.target.style.borderColor=C.orange}
    onBlur={e=>e.target.style.borderColor=C.border}>
    {children}
  </select>
);
const BtnPrimary = ({ children, loading, ...p }) => (
  <button {...p} style={{ background:C.orange, color:"#fff", border:"none", borderRadius:10, padding:"11px 24px", fontSize:14, fontWeight:700, cursor:"pointer", opacity: loading ? 0.7 : 1, transition:"opacity 0.2s" }}>
    {loading ? "저장중..." : children}
  </button>
);
const BtnSecondary = ({ children, ...p }) => (
  <button {...p} style={{ background:C.bg, color:C.sub, border:`1.5px solid ${C.border}`, borderRadius:10, padding:"11px 24px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
    {children}
  </button>
);

/* ═══════════════════════════════════════════════════════════════
   CONFIRM DELETE MODAL
═══════════════════════════════════════════════════════════════ */
function ConfirmModal({ open, onClose, onConfirm, name }) {
  return (
    <Modal open={open} onClose={onClose} title="삭제 확인" width={360}>
      <div style={{ textAlign:"center", padding:"8px 0 20px" }}>
        <div style={{ width:56, height:56, background:"#FEE2E2", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
          <Ic d={I.trash} size={24} color={C.red}/>
        </div>
        <p style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:8 }}>정말 삭제하시겠습니까?</p>
        <p style={{ fontSize:13, color:C.sub }}><strong style={{ color:C.text }}>{name}</strong> 항목이 영구 삭제됩니다.</p>
      </div>
      <div style={{ display:"flex", gap:10 }}>
        <BtnSecondary style={{ flex:1 }} onClick={onClose}>취소</BtnSecondary>
        <button onClick={onConfirm} style={{ flex:1, background:C.red, color:"#fff", border:"none", borderRadius:10, padding:"11px", fontSize:14, fontWeight:700, cursor:"pointer" }}>삭제</button>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUPABASE SETUP PAGE
═══════════════════════════════════════════════════════════════ */
function SetupPage({ onConnect }) {
  const [url, setUrl] = useState(localStorage.getItem("sb_url")||"");
  const [key, setKey] = useState(localStorage.getItem("sb_key")||"");
  const [testing, setTesting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("connect"); // connect | schema

  const test = async () => {
    if (!url || !key) { setErr("URL과 API 키를 모두 입력하세요."); return; }
    setTesting(true); setErr("");
    try {
      const r = await fetch(`${url}/rest/v1/villages?limit=1`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` }
      });
      if (r.status === 200 || r.status === 206) {
        localStorage.setItem("sb_url", url);
        localStorage.setItem("sb_key", key);
        onConnect(createSupabase(url, key));
      } else {
        const t = await r.text();
        setErr(`연결 실패: ${r.status} - ${t.slice(0,80)}`);
      }
    } catch(e) { setErr(`오류: ${e.message}`); }
    setTesting(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(SQL_SCHEMA);
    setCopied(true); setTimeout(()=>setCopied(false), 2000);
  };

  return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,#FFF0EB,#fff,#FFF8F5)`, display:"flex", alignItems:"center", justifyContent:"center", padding:20, fontFamily:"'Noto Sans KR', sans-serif" }}>
      <div style={{ width:"100%", maxWidth:580 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:60, height:60, background:C.orange, borderRadius:18, marginBottom:14, boxShadow:`0 8px 24px ${C.orangeM}` }}>
            <Ic d={I.db} size={28} color="#fff"/>
          </div>
          <div style={{ fontSize:24, fontWeight:800, color:C.text }}>Supabase 연동 설정</div>
          <div style={{ fontSize:13, color:C.sub, marginTop:4 }}>완주군 마을정보 포탈 데이터베이스 연결</div>
        </div>

        {/* Tabs */}
        <div style={{ display:"flex", background:C.bg, borderRadius:12, padding:4, marginBottom:20, border:`1px solid ${C.border}` }}>
          {[["connect","🔗 연결 설정"],["schema","📋 테이블 생성 SQL"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{ flex:1, padding:"9px", border:"none", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", background:tab===k?C.white:C.bg, color:tab===k?C.orange:C.sub, transition:"all 0.15s", boxShadow:tab===k?"0 1px 4px rgba(0,0,0,0.08)":"none" }}>{l}</button>
          ))}
        </div>

        <div style={{ background:C.white, borderRadius:24, padding:28, boxShadow:"0 4px 40px rgba(0,0,0,0.08)", border:`1px solid ${C.border}` }}>
          {tab === "connect" ? (
            <>
              {/* Steps */}
              <div style={{ background:C.bg, borderRadius:14, padding:16, marginBottom:24, border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:12, fontWeight:700, color:C.orange, marginBottom:10 }}>⚡ 연결 방법</div>
                {[
                  "supabase.com에서 새 프로젝트 생성",
                  "아래 \"테이블 생성 SQL\" 탭의 SQL을 Supabase SQL Editor에서 실행",
                  "Project Settings → API에서 URL과 anon key 복사",
                  "아래 입력란에 붙여넣고 연결 테스트 클릭",
                ].map((s,i)=>(
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom: i<3?8:0 }}>
                    <span style={{ width:20, height:20, background:C.orange, borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:800, color:"#fff", flexShrink:0, marginTop:1 }}>{i+1}</span>
                    <span style={{ fontSize:12.5, color:C.text }}>{s}</span>
                  </div>
                ))}
              </div>
              <Field label="Supabase Project URL" required>
                <Input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://xxxxxxxxxxxx.supabase.co"/>
              </Field>
              <Field label="Supabase Anon Key" required>
                <Input value={key} onChange={e=>setKey(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." type="password"/>
              </Field>
              {err && <div style={{ background:"#FEE2E2", border:"1px solid #FCA5A5", borderRadius:10, padding:"10px 14px", fontSize:13, color:C.red, marginBottom:16 }}>{err}</div>}
              <BtnPrimary loading={testing} onClick={test} style={{ width:"100%" }}>
                {testing ? "연결 확인중..." : "🔗 연결 테스트 및 시작"}
              </BtnPrimary>
              <div style={{ marginTop:16, padding:14, background:"#EFF6FF", borderRadius:12, border:"1px solid #BFDBFE" }}>
                <div style={{ fontSize:12, color:"#1D4ED8", fontWeight:700, marginBottom:4 }}>💡 데모 모드</div>
                <div style={{ fontSize:11.5, color:"#3B82F6" }}>Supabase 없이 샘플 데이터로 먼저 확인하려면 아래 버튼을 클릭하세요.</div>
                <button onClick={()=>onConnect(null)} style={{ marginTop:8, background:"#3B82F6", color:"#fff", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>📊 데모 모드로 시작</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.text }}>Supabase SQL Editor에서 실행하세요</span>
                <button onClick={copy} style={{ display:"flex", alignItems:"center", gap:6, background:copied?C.green:C.orangeL, border:"none", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:700, cursor:"pointer", color:copied?"#fff":C.orange, transition:"all 0.2s" }}>
                  <Ic d={copied?I.check:I.copy} size={13} color={copied?"#fff":C.orange}/>{copied?"복사됨!":"SQL 복사"}
                </button>
              </div>
              <pre style={{ background:"#1E1E2E", color:"#CDD6F4", borderRadius:14, padding:16, fontSize:11, overflowX:"auto", lineHeight:1.7, maxHeight:400, overflowY:"auto", margin:0 }}>
                <code>{SQL_SCHEMA}</code>
              </pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOADING SKELETON
═══════════════════════════════════════════════════════════════ */
const Skeleton = ({ h = 16, w = "100%", br = 8 }) => (
  <div style={{ height:h, width:w, background:`linear-gradient(90deg,${C.border} 25%,#E8E8F0 50%,${C.border} 75%)`, backgroundSize:"200% 100%", borderRadius:br, animation:"shimmer 1.5s infinite" }}/>
);

/* ═══════════════════════════════════════════════════════════════
   DEMO DATA (Supabase 없을 때)
═══════════════════════════════════════════════════════════════ */
const DEMO = {
  villages: [
    { id:1, name:"구이면 원기마을",  population:142, area:"12.3km²", representative:"김철수", phone:"063-290-1234", status:"활성" },
    { id:2, name:"소양면 화심마을",  population:98,  area:"8.7km²",  representative:"이영희", phone:"063-290-2345", status:"활성" },
    { id:3, name:"동상면 밀목마을",  population:67,  area:"15.2km²", representative:"박민준", phone:"063-290-3456", status:"활성" },
    { id:4, name:"운주면 고당마을",  population:203, area:"9.8km²",  representative:"최지원", phone:"063-290-4567", status:"점검중" },
    { id:5, name:"비봉면 내월마을",  population:155, area:"11.1km²", representative:"정수연", phone:"063-290-5678", status:"활성" },
  ],
  sales: [
    { id:1, company_name:"소양 두부마을기업",     category:"농산물가공", month:"2025-04", sales_amount:8420000,  prev_amount:7800000 },
    { id:2, company_name:"구이 친환경영농조합",   category:"농산물유통", month:"2025-04", sales_amount:12300000, prev_amount:11500000 },
    { id:3, company_name:"동상 산촌체험마을",     category:"체험관광",   month:"2025-04", sales_amount:5600000,  prev_amount:6100000 },
    { id:4, company_name:"완주 로컬푸드협동조합", category:"로컬푸드",   month:"2025-04", sales_amount:19800000, prev_amount:18200000 },
    { id:5, company_name:"운주 한옥펜션협동조합", category:"숙박관광",   month:"2025-04", sales_amount:7100000,  prev_amount:6900000 },
  ],
  subsidies: [
    { id:1, name:"농촌활력 마을만들기사업",    total_amount:150000000, used_amount:87000000,  period:"2025.01~12", status:"진행중" },
    { id:2, name:"마을기업 육성지원사업",      total_amount:80000000,  used_amount:80000000,  period:"2024.03~12", status:"완료" },
    { id:3, name:"농어촌 빈집정비사업",        total_amount:50000000,  used_amount:23000000,  period:"2025.02~11", status:"진행중" },
    { id:4, name:"귀농귀촌 정착지원사업",      total_amount:200000000, used_amount:45000000,  period:"2025.01~12", status:"진행중" },
    { id:5, name:"스마트농촌 ICT 인프라구축",  total_amount:300000000, used_amount:0,         period:"2025.06~",   status:"예정" },
  ],
  posts: [
    { id:1, title:"2025년 마을공동체 활성화 사업 공고",  author:"담당자", category:"공지", views:234, created_at:"2025-04-28" },
    { id:2, title:"봄 농촌체험 프로그램 참가자 모집",    author:"담당자", category:"행사", views:187, created_at:"2025-04-25" },
    { id:3, title:"마을기업 네트워크 정기 회의 안내",    author:"담당자", category:"회의", views:95,  created_at:"2025-04-22" },
    { id:4, title:"농촌관광 역량강화 교육 참가 안내",    author:"담당자", category:"교육", views:312, created_at:"2025-04-18" },
    { id:5, title:"완주군 로컬푸드 직거래장터 운영 현황",author:"담당자", category:"현황", views:421, created_at:"2025-04-15" },
    { id:6, title:"2분기 보조금 정산 제출 안내",        author:"담당자", category:"공지", views:156, created_at:"2025-04-10" },
  ],
};

/* ═══════════════════════════════════════════════════════════════
   DATA HOOK  (Supabase 또는 Demo)
═══════════════════════════════════════════════════════════════ */
function useData(sb, table, demoKey) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    setLoading(true);
    try {
      if (sb) {
        const r = await sb.select(table, { order:"id.desc" });
        setData(Array.isArray(r) ? r : []);
      } else {
        await new Promise(r=>setTimeout(r,400));
        setData([...DEMO[demoKey]]);
      }
    } catch(e) { console.error(e); setData([]); }
    setLoading(false);
  }, [sb, table, demoKey]);
  useEffect(() => { load(); }, [load]);
  return { data, setData, loading, reload: load };
}

/* ═══════════════════════════════════════════════════════════════
   VILLAGE MODAL
═══════════════════════════════════════════════════════════════ */
function VillageModal({ open, onClose, onSave, item }) {
  const blank = { name:"", population:"", area:"", representative:"", phone:"", status:"활성" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(item ? { ...item } : blank); }, [item, open]);
  const set = k => e => setForm(p=>({ ...p, [k]:e.target.value }));
  const save = async () => {
    if (!form.name) return;
    setSaving(true);
    await onSave({ ...form, population: Number(form.population)||0 });
    setSaving(false);
  };
  return (
    <Modal open={open} onClose={onClose} title={item?"마을 정보 수정":"마을 등록"}>
      <Field label="마을명" required><Input value={form.name} onChange={set("name")} placeholder="예) 구이면 원기마을"/></Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="인구"><Input type="number" value={form.population} onChange={set("population")} placeholder="142"/></Field>
        <Field label="면적"><Input value={form.area} onChange={set("area")} placeholder="12.3km²"/></Field>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="대표자"><Input value={form.representative} onChange={set("representative")} placeholder="홍길동"/></Field>
        <Field label="연락처"><Input value={form.phone} onChange={set("phone")} placeholder="063-000-0000"/></Field>
      </div>
      <Field label="상태">
        <Select value={form.status} onChange={set("status")}>
          {["활성","점검중","비활성"].map(s=><option key={s}>{s}</option>)}
        </Select>
      </Field>
      <div style={{ display:"flex", gap:10, marginTop:8 }}>
        <BtnSecondary style={{ flex:1 }} onClick={onClose}>취소</BtnSecondary>
        <BtnPrimary style={{ flex:2 }} loading={saving} onClick={save}>저장</BtnPrimary>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SALES MODAL
═══════════════════════════════════════════════════════════════ */
function SalesModal({ open, onClose, onSave, item }) {
  const blank = { company_name:"", category:"농산물가공", month:"2025-04", sales_amount:"", prev_amount:"" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(item ? { ...item } : blank); }, [item, open]);
  const set = k => e => setForm(p=>({ ...p, [k]:e.target.value }));
  const save = async () => {
    if (!form.company_name) return;
    setSaving(true);
    await onSave({ ...form, sales_amount:Number(form.sales_amount)||0, prev_amount:Number(form.prev_amount)||0 });
    setSaving(false);
  };
  const cats = ["농산물가공","농산물유통","체험관광","로컬푸드","숙박관광","기타"];
  return (
    <Modal open={open} onClose={onClose} title={item?"매출 수정":"매출 등록"}>
      <Field label="마을기업명" required><Input value={form.company_name} onChange={set("company_name")} placeholder="예) 소양 두부마을기업"/></Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="업종">
          <Select value={form.category} onChange={set("category")}>
            {cats.map(c=><option key={c}>{c}</option>)}
          </Select>
        </Field>
        <Field label="기준월"><Input type="month" value={form.month} onChange={set("month")}/></Field>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="이번달 매출 (원)"><Input type="number" value={form.sales_amount} onChange={set("sales_amount")} placeholder="8420000"/></Field>
        <Field label="전월 매출 (원)"><Input type="number" value={form.prev_amount} onChange={set("prev_amount")} placeholder="7800000"/></Field>
      </div>
      {form.sales_amount && form.prev_amount && (
        <div style={{ background:C.orangeL, borderRadius:10, padding:"10px 14px", fontSize:12.5, color:C.orange, fontWeight:600, marginBottom:16 }}>
          📊 전월 대비: {(((Number(form.sales_amount)-Number(form.prev_amount))/Number(form.prev_amount))*100).toFixed(1)}%
        </div>
      )}
      <div style={{ display:"flex", gap:10 }}>
        <BtnSecondary style={{ flex:1 }} onClick={onClose}>취소</BtnSecondary>
        <BtnPrimary style={{ flex:2 }} loading={saving} onClick={save}>저장</BtnPrimary>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBSIDY MODAL
═══════════════════════════════════════════════════════════════ */
function SubsidyModal({ open, onClose, onSave, item }) {
  const blank = { name:"", total_amount:"", used_amount:"", period:"", status:"진행중" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(item ? { ...item } : blank); }, [item, open]);
  const set = k => e => setForm(p=>({ ...p, [k]:e.target.value }));
  const save = async () => {
    if (!form.name) return;
    setSaving(true);
    await onSave({ ...form, total_amount:Number(form.total_amount)||0, used_amount:Number(form.used_amount)||0 });
    setSaving(false);
  };
  const execRate = form.total_amount ? pct(Number(form.used_amount)||0, Number(form.total_amount)) : 0;
  return (
    <Modal open={open} onClose={onClose} title={item?"사업 수정":"사업 등록"}>
      <Field label="사업명" required><Input value={form.name} onChange={set("name")} placeholder="예) 농촌활력 마을만들기사업"/></Field>
      <Field label="사업 기간"><Input value={form.period} onChange={set("period")} placeholder="예) 2025.01~12"/></Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="총 예산 (원)"><Input type="number" value={form.total_amount} onChange={set("total_amount")} placeholder="150000000"/></Field>
        <Field label="집행 금액 (원)"><Input type="number" value={form.used_amount} onChange={set("used_amount")} placeholder="87000000"/></Field>
      </div>
      {form.total_amount > 0 && (
        <div style={{ marginBottom:16 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:C.sub, marginBottom:6 }}>
            <span>집행률</span><span style={{ fontWeight:700, color:C.orange }}>{execRate}%</span>
          </div>
          <div style={{ height:6, background:C.border, borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${execRate}%`, background:C.orange, borderRadius:3, transition:"width 0.4s" }}/>
          </div>
        </div>
      )}
      <Field label="상태">
        <Select value={form.status} onChange={set("status")}>
          {["진행중","완료","예정","중단"].map(s=><option key={s}>{s}</option>)}
        </Select>
      </Field>
      <div style={{ display:"flex", gap:10 }}>
        <BtnSecondary style={{ flex:1 }} onClick={onClose}>취소</BtnSecondary>
        <BtnPrimary style={{ flex:2 }} loading={saving} onClick={save}>저장</BtnPrimary>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   POST MODAL
═══════════════════════════════════════════════════════════════ */
function PostModal({ open, onClose, onSave, item }) {
  const blank = { title:"", author:"담당자", category:"공지", content:"" };
  const [form, setForm] = useState(blank);
  const [saving, setSaving] = useState(false);
  useEffect(() => { setForm(item ? { ...item } : blank); }, [item, open]);
  const set = k => e => setForm(p=>({ ...p, [k]:e.target.value }));
  const save = async () => {
    if (!form.title) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };
  return (
    <Modal open={open} onClose={onClose} title={item?"게시글 수정":"글쓰기"} width={560}>
      <Field label="제목" required><Input value={form.title} onChange={set("title")} placeholder="게시글 제목을 입력하세요"/></Field>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Field label="작성자"><Input value={form.author} onChange={set("author")} placeholder="담당자"/></Field>
        <Field label="분류">
          <Select value={form.category} onChange={set("category")}>
            {["공지","행사","회의","교육","현황","기타"].map(c=><option key={c}>{c}</option>)}
          </Select>
        </Field>
      </div>
      <Field label="내용">
        <textarea value={form.content||""} onChange={set("content")} placeholder="내용을 입력하세요..."
          style={{ ...inputStyle, minHeight:120, resize:"vertical", lineHeight:1.6 }}
          onFocus={e=>e.target.style.borderColor=C.orange} onBlur={e=>e.target.style.borderColor=C.border}/>
      </Field>
      <div style={{ display:"flex", gap:10 }}>
        <BtnSecondary style={{ flex:1 }} onClick={onClose}>취소</BtnSecondary>
        <BtnPrimary style={{ flex:2 }} loading={saving} onClick={save}>게시하기</BtnPrimary>
      </div>
    </Modal>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
═══════════════════════════════════════════════════════════════ */
function Dashboard({ sb }) {
  const { data: villages, loading: lv } = useData(sb, "villages", "villages");
  const { data: sales,    loading: ls } = useData(sb, "sales",    "sales");
  const { data: subsidies,loading: lsu} = useData(sb, "subsidies","subsidies");
  const { data: posts,    loading: lp } = useData(sb, "posts",    "posts");

  const totalSales = sales.reduce((s,d)=>s+(d.sales_amount||0),0);
  const totalPrev  = sales.reduce((s,d)=>s+(d.prev_amount||0),0);
  const totalB     = subsidies.reduce((s,d)=>s+(d.total_amount||0),0);
  const totalU     = subsidies.reduce((s,d)=>s+(d.used_amount||0),0);
  const gr         = totalPrev > 0 ? (((totalSales-totalPrev)/totalPrev)*100).toFixed(1) : "0";
  const totalPop   = villages.reduce((s,v)=>s+(v.population||0),0);

  const chartData  = sales.slice(0,6).map(d=>({ name:d.company_name?.substring(0,5), sales:Math.round((d.sales_amount||0)/1e6) }));
  const pieData    = [{ value:totalU },{ value: Math.max(totalB-totalU,0) }];

  const loading = lv || ls || lsu || lp;
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%", display:"flex", flexDirection:"column", gap:16 }}>
      {/* Top Row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 220px", gap:16, alignItems:"start" }}>
        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {/* Hero card */}
          <div style={{ background:"linear-gradient(135deg,#1A1A2E,#2D2D4E)", borderRadius:20, padding:22, position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute",right:-20,top:-20,width:130,height:130,borderRadius:"50%",background:"rgba(255,90,31,0.15)" }}/>
            <div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:6 }}>이번달 마을기업 총 매출</div>
            {loading ? <Skeleton h={40} w={200} br={8}/> : (
              <div style={{ display:"flex", alignItems:"baseline", gap:4, marginBottom:8 }}>
                <span style={{ fontSize:34,fontWeight:800,color:"#fff" }}>₩{(totalSales/1e6).toFixed(1)}</span>
                <span style={{ fontSize:16,color:"rgba(255,255,255,0.5)" }}>백만원</span>
              </div>
            )}
            <div style={{ display:"inline-flex",alignItems:"center",gap:4,background:"rgba(34,197,94,0.2)",borderRadius:50,padding:"4px 10px" }}>
              <Ic d={I.up} size={11} color={C.green}/>
              <span style={{ fontSize:12,color:C.green,fontWeight:600 }}>+{gr}% 전월 대비</span>
            </div>
            <div style={{ position:"absolute",right:20,top:"50%",transform:"translateY(-50%)",width:90,height:58,background:`linear-gradient(135deg,${C.orange},#FF8C42)`,borderRadius:10,opacity:0.9 }}>
              <div style={{ position:"absolute",bottom:8,left:8,width:16,height:11,border:"2px solid rgba(255,255,255,0.6)",borderRadius:3 }}/>
              <div style={{ position:"absolute",top:8,right:8,fontSize:12 }}>🌿</div>
            </div>
          </div>
          {/* Stat cards */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:10 }}>
            {[
              { l:"마을 수",   v:`${villages.length}개`,        c:C.orange, bg:C.orangeL },
              { l:"총 주민",   v:`${fmt(totalPop)}명`,          c:C.blue,   bg:"#EFF6FF" },
              { l:"집행률",    v:`${pct(totalU,totalB)}%`,      c:"#8B5CF6",bg:"#F5F3FF" },
              { l:"게시물",    v:`${posts.length}건`,           c:C.green,  bg:"#F0FDF4" },
            ].map((s,i)=>(
              <div key={i} style={{ background:C.white,borderRadius:14,padding:14,border:`1px solid ${C.border}` }}>
                <div style={{ fontSize:11,color:C.sub,marginBottom:6 }}>{s.l}</div>
                {loading ? <Skeleton h={24} br={6}/> : <div style={{ fontSize:20,fontWeight:800,color:s.c }}>{s.v}</div>}
              </div>
            ))}
          </div>
        </div>
        {/* Right panel */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {/* Recent */}
          <div style={{ background:C.white,borderRadius:18,padding:16,border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:12 }}>최근 매출</div>
            {loading ? [1,2,3].map(i=><Skeleton key={i} h={34} br={8} style={{ marginBottom:8 }}/>) :
              sales.slice(0,4).map((d,i)=>{
                const diff=(d.sales_amount||0)-(d.prev_amount||0);
                return (
                  <div key={i} style={{ display:"flex",alignItems:"center",gap:8,marginBottom:i<3?10:0 }}>
                    <div style={{ width:32,height:32,background:C.orangeL,borderRadius:9,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0 }}>🏪</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:11,fontWeight:600,color:C.text,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis" }}>{d.company_name}</div>
                      <div style={{ fontSize:10,color:C.sub }}>{d.category}</div>
                    </div>
                    <div style={{ fontSize:11,fontWeight:700,color:diff>=0?C.green:C.red,whiteSpace:"nowrap" }}>{diff>=0?"+":""}{fmtM(diff)}</div>
                  </div>
                );
              })
            }
          </div>
          {/* Donut */}
          <div style={{ background:C.white,borderRadius:18,padding:16,border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:13,fontWeight:700,color:C.text,marginBottom:10 }}>보조금 집행</div>
            <div style={{ position:"relative",width:90,height:90,margin:"0 auto 8px" }}>
              <PieChart width={90} height={90}>
                <Pie data={pieData} cx={40} cy={40} innerRadius={28} outerRadius={40} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                  <Cell fill={C.orange}/><Cell fill={C.orangeL}/>
                </Pie>
              </PieChart>
              <div style={{ position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ fontSize:14,fontWeight:800,color:C.text }}>{pct(totalU,totalB)}%</span>
              </div>
            </div>
            <div style={{ fontSize:11,color:C.sub,textAlign:"center" }}>₩{(totalU/1e8).toFixed(1)}억 / ₩{(totalB/1e8).toFixed(1)}억</div>
          </div>
        </div>
      </div>

      {/* Chart row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
        <div style={{ background:C.white,borderRadius:18,padding:18,border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:14 }}>기업별 매출 (백만원)</div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={chartData} barSize={18}>
              <XAxis dataKey="name" tick={{ fontSize:10,fill:C.sub }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize:10,fill:C.sub }} axisLine={false} tickLine={false}/>
              <Tooltip formatter={v=>[`₩${v}M`]} contentStyle={{ borderRadius:10,border:`1px solid ${C.border}`,fontSize:12 }}/>
              <Bar dataKey="sales" radius={[6,6,0,0]}>
                {chartData.map((d,i)=><Cell key={i} fill={i===0?C.orange:C.orangeM}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ background:C.white,borderRadius:18,padding:18,border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:12 }}>최근 게시물</div>
          {loading ? [1,2,3,4].map(i=><Skeleton key={i} h={24} br={6} style={{ marginBottom:8 }}/>) :
            posts.slice(0,5).map((p,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:i<4?`1px solid ${C.border}`:"none" }}>
                <span style={{ fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:50,background:p.category==="공지"?"#FEE2E2":"#F1F5F9",color:p.category==="공지"?"#DC2626":"#64748B",whiteSpace:"nowrap" }}>{p.category}</span>
                <span style={{ fontSize:12,color:C.text,flex:1,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis" }}>{p.title}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   VILLAGE PAGE
═══════════════════════════════════════════════════════════════ */
function VillagePage({ sb, toast }) {
  const { data, loading, reload, setData } = useData(sb, "villages", "villages");
  const [modal, setModal]   = useState(false);
  const [editItem, setEdit] = useState(null);
  const [delItem, setDel]   = useState(null);
  const [q, setQ]           = useState("");

  const save = async (form) => {
    try {
      if (editItem) {
        if (sb) { await sb.update("villages", editItem.id, form); await reload(); }
        else setData(p=>p.map(d=>d.id===editItem.id?{...d,...form}:d));
        toast.show("마을 정보가 수정되었습니다.");
      } else {
        if (sb) { await sb.insert("villages", form); await reload(); }
        else setData(p=>[{ id:Date.now(), ...form }, ...p]);
        toast.show("마을이 등록되었습니다.");
      }
      setModal(false); setEdit(null);
    } catch(e) { toast.show(e.message,"error"); }
  };
  const del = async () => {
    try {
      if (sb) { await sb.delete("villages", delItem.id); await reload(); }
      else setData(p=>p.filter(d=>d.id!==delItem.id));
      toast.show("삭제되었습니다."); setDel(null);
    } catch(e) { toast.show(e.message,"error"); }
  };

  const filtered = data.filter(v=>(v.name||"").includes(q));
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <VillageModal open={modal} onClose={()=>{setModal(false);setEdit(null);}} onSave={save} item={editItem}/>
      <ConfirmModal open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} name={delItem?.name}/>
      <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
        <div style={{ position:"relative",flex:1,minWidth:200 }}>
          <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.sub }}><Ic d={I.search} size={14}/></div>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="마을명 검색..."
            style={{ ...inputStyle, paddingLeft:36, borderRadius:50 }}/>
        </div>
        <button onClick={()=>{ setEdit(null); setModal(true); }} style={{ background:C.orange,color:"#fff",border:"none",borderRadius:12,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
          <Ic d={I.plus} size={15} color="#fff"/> 마을 등록
        </button>
        <button onClick={reload} style={{ background:C.bg,color:C.sub,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"9px 12px",cursor:"pointer",display:"flex" }}>
          <Ic d={I.refresh} size={16}/>
        </button>
      </div>
      <div style={{ background:C.white,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:620 }}>
            <thead><tr style={{ background:C.bg }}>
              {["번호","마을명","인구","면적","대표자","연락처","상태","관리"].map(h=>(
                <th key={h} style={{ padding:"12px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.sub,borderBottom:`1px solid ${C.border}`,whiteSpace:"nowrap" }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? [1,2,3,4,5].map(i=>(
                <tr key={i}><td colSpan={8} style={{ padding:"14px 16px" }}><Skeleton h={20} br={6}/></td></tr>
              )) : filtered.map((v)=>(
                <tr key={v.id} style={{ borderBottom:`1px solid ${C.border}` }}
                  onMouseOver={e=>e.currentTarget.style.background=C.bg}
                  onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"13px 16px",fontSize:12,color:C.sub }}>{v.id}</td>
                  <td style={{ padding:"13px 16px",fontSize:13,fontWeight:700,color:C.text }}>{v.name}</td>
                  <td style={{ padding:"13px 16px",fontSize:13,color:C.text }}>{v.population}명</td>
                  <td style={{ padding:"13px 16px",fontSize:13,color:C.text }}>{v.area}</td>
                  <td style={{ padding:"13px 16px",fontSize:13,color:C.text }}>{v.representative}</td>
                  <td style={{ padding:"13px 16px",fontSize:13,color:C.sub }}>{v.phone}</td>
                  <td style={{ padding:"13px 16px" }}>
                    <span style={{ fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:50,background:v.status==="활성"?"#F0FDF4":"#FFFBEB",color:v.status==="활성"?C.green:"#D97706" }}>{v.status}</span>
                  </td>
                  <td style={{ padding:"13px 16px" }}>
                    <div style={{ display:"flex",gap:6 }}>
                      <button onClick={()=>{setEdit(v);setModal(true);}} style={{ background:C.orangeL,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer" }}><Ic d={I.edit} size={13} color={C.orange}/></button>
                      <button onClick={()=>setDel(v)} style={{ background:"#FEE2E2",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer" }}><Ic d={I.trash} size={13} color={C.red}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length===0 && (
          <div style={{ padding:40,textAlign:"center",color:C.sub,fontSize:14 }}>등록된 마을이 없습니다.</div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SALES PAGE
═══════════════════════════════════════════════════════════════ */
function SalesPage({ sb, toast }) {
  const { data, loading, reload, setData } = useData(sb, "sales", "sales");
  const [modal, setModal] = useState(false);
  const [editItem, setEdit] = useState(null);
  const [delItem, setDel]  = useState(null);

  const save = async (form) => {
    try {
      if (editItem) {
        if (sb) { await sb.update("sales", editItem.id, form); await reload(); }
        else setData(p=>p.map(d=>d.id===editItem.id?{...d,...form}:d));
        toast.show("매출 정보가 수정되었습니다.");
      } else {
        if (sb) { await sb.insert("sales", form); await reload(); }
        else setData(p=>[{id:Date.now(),...form},...p]);
        toast.show("매출이 등록되었습니다.");
      }
      setModal(false); setEdit(null);
    } catch(e) { toast.show(e.message,"error"); }
  };
  const del = async () => {
    try {
      if (sb) { await sb.delete("sales", delItem.id); await reload(); }
      else setData(p=>p.filter(d=>d.id!==delItem.id));
      toast.show("삭제되었습니다."); setDel(null);
    } catch(e) { toast.show(e.message,"error"); }
  };

  const total = data.reduce((s,d)=>s+(d.sales_amount||0),0);
  const prevT = data.reduce((s,d)=>s+(d.prev_amount||0),0);
  const gr = prevT>0?(((total-prevT)/prevT)*100).toFixed(1):"0";
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <SalesModal open={modal} onClose={()=>{setModal(false);setEdit(null);}} onSave={save} item={editItem}/>
      <ConfirmModal open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} name={delItem?.company_name}/>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:18 }}>
        {[
          { l:"총 매출", v:fmtM(total), sub:`+${gr}% 성장`, c:C.orange },
          { l:"마을기업 수", v:`${data.length}개`, sub:"등록 기업", c:C.blue },
          { l:"기업당 평균", v:fmtM(data.length?total/data.length:0), sub:"월 평균", c:"#8B5CF6" },
        ].map((s,i)=>(
          <div key={i} style={{ background:C.white,borderRadius:16,padding:16,border:`1px solid ${C.border}` }}>
            <div style={{ fontSize:11,color:C.sub }}>{s.l}</div>
            {loading?<Skeleton h={26} w={100} br={6} style={{ margin:"6px 0 4px" }}/>:<div style={{ fontSize:20,fontWeight:800,color:s.c,margin:"6px 0 4px" }}>{s.v}</div>}
            <div style={{ fontSize:11,color:C.sub }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <span style={{ fontSize:15,fontWeight:700,color:C.text }}>기업별 매출 상세</span>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={reload} style={{ background:C.bg,color:C.sub,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",display:"flex" }}><Ic d={I.refresh} size={15}/></button>
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{ background:C.orange,color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
            <Ic d={I.plus} size={14} color="#fff"/> 매출 등록
          </button>
        </div>
      </div>
      <div style={{ background:C.white,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:520 }}>
            <thead><tr style={{ background:C.bg }}>
              {["기업명","업종","기준월","이번달 매출","전월 매출","증감율","관리"].map(h=>(
                <th key={h} style={{ padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.sub,borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading?[1,2,3].map(i=><tr key={i}><td colSpan={7} style={{ padding:"14px 16px" }}><Skeleton h={20} br={6}/></td></tr>):
              data.map(d=>{
                const diff=(d.sales_amount||0)-(d.prev_amount||0);
                const rate=d.prev_amount?((diff/d.prev_amount)*100).toFixed(1):"0";
                return (
                  <tr key={d.id} style={{ borderBottom:`1px solid ${C.border}` }}
                    onMouseOver={e=>e.currentTarget.style.background=C.bg}
                    onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"12px 16px",fontSize:13,fontWeight:700,color:C.text }}>{d.company_name}</td>
                    <td style={{ padding:"12px 16px" }}><span style={{ fontSize:11,background:C.orangeL,color:C.orange,borderRadius:50,padding:"3px 10px",fontWeight:700 }}>{d.category}</span></td>
                    <td style={{ padding:"12px 16px",fontSize:12,color:C.sub }}>{d.month}</td>
                    <td style={{ padding:"12px 16px",fontSize:13,fontWeight:700,color:C.text }}>₩{fmt(d.sales_amount)}</td>
                    <td style={{ padding:"12px 16px",fontSize:13,color:C.sub }}>₩{fmt(d.prev_amount)}</td>
                    <td style={{ padding:"12px 16px" }}>
                      <span style={{ fontSize:13,fontWeight:700,color:diff>=0?C.green:C.red,display:"flex",alignItems:"center",gap:3 }}>
                        <Ic d={diff>=0?I.up:I.down} size={11} color={diff>=0?C.green:C.red}/>{Math.abs(rate)}%
                      </span>
                    </td>
                    <td style={{ padding:"12px 16px" }}>
                      <div style={{ display:"flex",gap:6 }}>
                        <button onClick={()=>{setEdit(d);setModal(true);}} style={{ background:C.orangeL,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer" }}><Ic d={I.edit} size={13} color={C.orange}/></button>
                        <button onClick={()=>setDel(d)} style={{ background:"#FEE2E2",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer" }}><Ic d={I.trash} size={13} color={C.red}/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {!loading&&data.length===0&&<div style={{ padding:40,textAlign:"center",color:C.sub,fontSize:14 }}>등록된 매출 데이터가 없습니다.</div>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SUBSIDY PAGE
═══════════════════════════════════════════════════════════════ */
function SubsidyPage({ sb, toast }) {
  const { data, loading, reload, setData } = useData(sb, "subsidies", "subsidies");
  const [modal, setModal] = useState(false);
  const [editItem, setEdit] = useState(null);
  const [delItem, setDel]  = useState(null);

  const save = async (form) => {
    try {
      if (editItem) {
        if (sb) { await sb.update("subsidies", editItem.id, form); await reload(); }
        else setData(p=>p.map(d=>d.id===editItem.id?{...d,...form}:d));
        toast.show("사업 정보가 수정되었습니다.");
      } else {
        if (sb) { await sb.insert("subsidies", form); await reload(); }
        else setData(p=>[{id:Date.now(),...form},...p]);
        toast.show("사업이 등록되었습니다.");
      }
      setModal(false); setEdit(null);
    } catch(e) { toast.show(e.message,"error"); }
  };
  const del = async () => {
    try {
      if (sb) { await sb.delete("subsidies", delItem.id); await reload(); }
      else setData(p=>p.filter(d=>d.id!==delItem.id));
      toast.show("삭제되었습니다."); setDel(null);
    } catch(e) { toast.show(e.message,"error"); }
  };

  const totalB = data.reduce((s,d)=>s+(d.total_amount||0),0);
  const totalU = data.reduce((s,d)=>s+(d.used_amount||0),0);
  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <SubsidyModal open={modal} onClose={()=>{setModal(false);setEdit(null);}} onSave={save} item={editItem}/>
      <ConfirmModal open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} name={delItem?.name}/>
      <div style={{ background:`linear-gradient(135deg,${C.orange},#FF8C42)`,borderRadius:20,padding:22,marginBottom:18,color:"#fff",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",right:-30,top:-30,width:150,height:150,borderRadius:"50%",background:"rgba(255,255,255,0.1)" }}/>
        <div style={{ fontSize:12,opacity:0.8,marginBottom:4 }}>2025년 총 보조금 예산</div>
        {loading?<Skeleton h={36} w={180} br={8} style={{ marginBottom:12 }}/>:<div style={{ fontSize:30,fontWeight:800,marginBottom:12 }}>₩{(totalB/1e8).toFixed(1)}억원</div>}
        <div style={{ height:8,background:"rgba(255,255,255,0.25)",borderRadius:4,overflow:"hidden",marginBottom:6 }}>
          <div style={{ height:"100%",width:`${pct(totalU,totalB)}%`,background:"#fff",borderRadius:4,transition:"width 0.5s" }}/>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:12,opacity:0.9 }}>
          <span>집행: ₩{(totalU/1e8).toFixed(1)}억</span>
          <span style={{ fontWeight:700 }}>{pct(totalU,totalB)}% 집행</span>
        </div>
      </div>
      <div style={{ display:"flex",justifyContent:"flex-end",gap:8,marginBottom:14 }}>
        <button onClick={reload} style={{ background:C.bg,color:C.sub,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",display:"flex" }}><Ic d={I.refresh} size={15}/></button>
        <button onClick={()=>{setEdit(null);setModal(true);}} style={{ background:C.orange,color:"#fff",border:"none",borderRadius:12,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
          <Ic d={I.plus} size={14} color="#fff"/> 사업 등록
        </button>
      </div>
      <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
        {loading?[1,2,3].map(i=><div key={i} style={{ background:C.white,borderRadius:20,padding:20,border:`1px solid ${C.border}` }}><Skeleton h={80} br={8}/></div>):
        data.map(s=>{
          const rate=pct(s.used_amount||0,s.total_amount||0);
          const sc=s.status==="완료"?{bg:"#F0FDF4",c:C.green}:s.status==="예정"?{bg:"#F1F5F9",c:C.sub}:{bg:C.orangeL,c:C.orange};
          return (
            <div key={s.id} style={{ background:C.white,borderRadius:20,padding:20,border:`1px solid ${C.border}` }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:14,fontWeight:700,color:C.text,marginBottom:2 }}>{s.name}</div>
                  <div style={{ fontSize:11,color:C.sub }}>{s.period}</div>
                </div>
                <div style={{ display:"flex",gap:8,alignItems:"center" }}>
                  <span style={{ fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:50,background:sc.bg,color:sc.c }}>{s.status}</span>
                  <button onClick={()=>{setEdit(s);setModal(true);}} style={{ background:C.orangeL,border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer" }}><Ic d={I.edit} size={13} color={C.orange}/></button>
                  <button onClick={()=>setDel(s)} style={{ background:"#FEE2E2",border:"none",borderRadius:8,padding:"6px 8px",cursor:"pointer" }}><Ic d={I.trash} size={13} color={C.red}/></button>
                </div>
              </div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:12 }}>
                {[{l:"예산",c:C.text,v:(s.total_amount||0)},{l:"집행",c:C.blue,v:(s.used_amount||0)},{l:"잔액",c:C.green,v:(s.total_amount||0)-(s.used_amount||0)}].map((x,i)=>(
                  <div key={i} style={{ background:C.bg,borderRadius:10,padding:"10px",textAlign:"center" }}>
                    <div style={{ fontSize:10,color:C.sub,marginBottom:2 }}>{x.l}</div>
                    <div style={{ fontSize:13,fontWeight:800,color:x.c }}>₩{(x.v/1e6).toFixed(0)}M</div>
                  </div>
                ))}
              </div>
              <div style={{ height:6,background:C.border,borderRadius:3,overflow:"hidden" }}>
                <div style={{ height:"100%",width:`${rate}%`,background:s.status==="완료"?C.green:s.status==="예정"?"#CBD5E1":C.orange,borderRadius:3,transition:"width 0.4s" }}/>
              </div>
              <div style={{ textAlign:"right",fontSize:11,color:C.sub,marginTop:4 }}>{rate}% 집행</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   BOARD PAGE
═══════════════════════════════════════════════════════════════ */
function BoardPage({ sb, toast }) {
  const { data, loading, reload, setData } = useData(sb, "posts", "posts");
  const [modal, setModal] = useState(false);
  const [editItem, setEdit] = useState(null);
  const [delItem, setDel]  = useState(null);
  const [filter, setFilter] = useState("전체");

  const save = async (form) => {
    try {
      if (editItem) {
        if (sb) { await sb.update("posts", editItem.id, form); await reload(); }
        else setData(p=>p.map(d=>d.id===editItem.id?{...d,...form}:d));
        toast.show("게시글이 수정되었습니다.");
      } else {
        const newPost = { ...form, views:0, created_at:new Date().toISOString().slice(0,10) };
        if (sb) { await sb.insert("posts", newPost); await reload(); }
        else setData(p=>[{id:Date.now(),...newPost},...p]);
        toast.show("게시글이 등록되었습니다.");
      }
      setModal(false); setEdit(null);
    } catch(e) { toast.show(e.message,"error"); }
  };
  const del = async () => {
    try {
      if (sb) { await sb.delete("posts", delItem.id); await reload(); }
      else setData(p=>p.filter(d=>d.id!==delItem.id));
      toast.show("삭제되었습니다."); setDel(null);
    } catch(e) { toast.show(e.message,"error"); }
  };

  const cats = ["전체","공지","행사","회의","교육","현황"];
  const filtered = filter==="전체" ? data : data.filter(p=>p.category===filter);
  const catColor = (c) => c==="공지"?"#DC2626":c==="행사"?"#B45309":"#64748B";
  const catBg    = (c) => c==="공지"?"#FEE2E2":c==="행사"?"#FEF9C3":"#F1F5F9";

  return (
    <div style={{ padding:20, overflowY:"auto", height:"100%" }}>
      <PostModal open={modal} onClose={()=>{setModal(false);setEdit(null);}} onSave={save} item={editItem}/>
      <ConfirmModal open={!!delItem} onClose={()=>setDel(null)} onConfirm={del} name={delItem?.title}/>
      <div style={{ display:"flex",gap:8,marginBottom:18,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setFilter(c)} style={{ padding:"7px 14px",borderRadius:50,border:`1.5px solid ${filter===c?C.orange:C.border}`,background:filter===c?C.orange:"#fff",color:filter===c?"#fff":C.sub,fontSize:12,fontWeight:600,cursor:"pointer",transition:"all 0.15s" }}>{c}</button>
          ))}
        </div>
        <div style={{ display:"flex",gap:8 }}>
          <button onClick={reload} style={{ background:C.bg,color:C.sub,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"8px 12px",cursor:"pointer",display:"flex" }}><Ic d={I.refresh} size={15}/></button>
          <button onClick={()=>{setEdit(null);setModal(true);}} style={{ background:C.orange,color:"#fff",border:"none",borderRadius:12,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:6 }}>
            <Ic d={I.plus} size={14} color="#fff"/> 글쓰기
          </button>
        </div>
      </div>
      <div style={{ background:C.white,borderRadius:20,border:`1px solid ${C.border}`,overflow:"hidden" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%",borderCollapse:"collapse",minWidth:520 }}>
            <thead><tr style={{ background:C.bg }}>
              {["번호","분류","제목","작성자","날짜","조회","관리"].map(h=>(
                <th key={h} style={{ padding:"11px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:C.sub,borderBottom:`1px solid ${C.border}` }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading?[1,2,3,4].map(i=><tr key={i}><td colSpan={7} style={{ padding:"14px 16px" }}><Skeleton h={20} br={6}/></td></tr>):
              filtered.map(p=>(
                <tr key={p.id} style={{ borderBottom:`1px solid ${C.border}`,cursor:"pointer" }}
                  onMouseOver={e=>e.currentTarget.style.background=C.bg}
                  onMouseOut={e=>e.currentTarget.style.background="transparent"}>
                  <td style={{ padding:"12px 16px",fontSize:12,color:C.sub }}>{p.id}</td>
                  <td style={{ padding:"12px 16px" }}><span style={{ fontSize:11,fontWeight:700,padding:"3px 9px",borderRadius:50,background:catBg(p.category),color:catColor(p.category) }}>{p.category}</span></td>
                  <td style={{ padding:"12px 16px",fontSize:13,fontWeight:600,color:C.text,maxWidth:260,overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis" }}>{p.title}</td>
                  <td style={{ padding:"12px 16px",fontSize:12,color:C.sub }}>{p.author}</td>
                  <td style={{ padding:"12px 16px",fontSize:12,color:C.sub,whiteSpace:"nowrap" }}>{(p.created_at||"").slice(0,10)}</td>
                  <td style={{ padding:"12px 16px" }}><span style={{ fontSize:12,color:C.sub,display:"flex",alignItems:"center",gap:3 }}><Ic d={I.eye} size={12}/>{p.views||0}</span></td>
                  <td style={{ padding:"12px 16px" }}>
                    <div style={{ display:"flex",gap:6 }}>
                      <button onClick={()=>{setEdit(p);setModal(true);}} style={{ background:C.orangeL,border:"none",borderRadius:8,padding:"5px 7px",cursor:"pointer" }}><Ic d={I.edit} size={12} color={C.orange}/></button>
                      <button onClick={()=>setDel(p)} style={{ background:"#FEE2E2",border:"none",borderRadius:8,padding:"5px 7px",cursor:"pointer" }}><Ic d={I.trash} size={12} color={C.red}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading&&filtered.length===0&&<div style={{ padding:40,textAlign:"center",color:C.sub,fontSize:14 }}>게시글이 없습니다.</div>}
        <div style={{ padding:14,display:"flex",justifyContent:"center",gap:6 }}>
          {[1,2,3,4,5].map(n=>(
            <button key={n} style={{ width:32,height:32,borderRadius:8,border:`1.5px solid ${n===1?C.orange:C.border}`,background:n===1?C.orange:"#fff",color:n===1?"#fff":C.sub,fontSize:13,fontWeight:600,cursor:"pointer" }}>{n}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SIDEBAR / TOPBAR / TABS
═══════════════════════════════════════════════════════════════ */
const NAV = [
  { key:"dashboard",label:"대시보드",     icon:I.dash    },
  { key:"village",  label:"마을정보관리", icon:I.village },
  { key:"sales",    label:"마을기업 매출",icon:I.sales   },
  { key:"subsidy",  label:"보조금사업관리",icon:I.subsidy },
  { key:"board",    label:"게시판",       icon:I.board   },
];
const EMOJI = { dashboard:"🏠",village:"🏘️",sales:"💰",subsidy:"📋",board:"📢" };

function Sidebar({ active, tabs, onNav, mobile, onClose, onLogout, isDemo }) {
  return (
    <div style={{ width:mobile?"100%":214,height:"100%",background:C.white,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",padding:"18px 10px",boxSizing:"border-box" }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,padding:"0 8px",marginBottom:24 }}>
        <div style={{ width:34,height:34,background:C.orange,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16 }}>🌿</div>
        <div>
          <div style={{ fontSize:13,fontWeight:800,color:C.text }}>완주군 포탈</div>
          {isDemo&&<div style={{ fontSize:9,background:C.orangeL,color:C.orange,borderRadius:4,padding:"1px 5px",fontWeight:700,marginTop:2 }}>DEMO</div>}
        </div>
        {mobile&&<button onClick={onClose} style={{ marginLeft:"auto",background:"none",border:"none",cursor:"pointer",color:C.sub }}><Ic d={I.close} size={18}/></button>}
      </div>
      <nav style={{ flex:1 }}>
        {NAV.map(n=>{
          const isOpen=tabs.some(t=>t.key===n.key);
          const isActive=active===n.key;
          return (
            <button key={n.key} onClick={()=>{onNav(n.key);onClose?.();}}
              style={{ width:"100%",display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:12,border:"none",cursor:"pointer",marginBottom:3,transition:"all 0.15s",background:isActive?C.orangeL:"transparent",color:isActive?C.orange:C.sub }}>
              <Ic d={n.icon} size={17} color={isActive?C.orange:C.sub}/>
              <span style={{ fontSize:13,fontWeight:isActive?700:500 }}>{n.label}</span>
              {isOpen&&!isActive&&<span style={{ marginLeft:"auto",width:6,height:6,borderRadius:"50%",background:C.orangeM }}/>}
            </button>
          );
        })}
      </nav>
      <div style={{ borderTop:`1px solid ${C.border}`,paddingTop:14,display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:34,height:34,background:C.orange,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center" }}>
          <Ic d={I.user} size={15} color="#fff"/>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:12,fontWeight:700,color:C.text }}>관리자</div>
          <div style={{ fontSize:10,color:C.sub }}>admin@wanju.go.kr</div>
        </div>
        <button onClick={onLogout} title="로그아웃" style={{ background:"none",border:"none",cursor:"pointer",color:C.sub,padding:4 }}><Ic d={I.logout} size={15}/></button>
      </div>
    </div>
  );
}

function TabBar({ tabs, active, onSelect, onClose }) {
  return (
    <div style={{ display:"flex",alignItems:"center",background:C.bg,borderBottom:`1px solid ${C.border}`,overflowX:"auto",flexShrink:0,minHeight:38 }}>
      {tabs.map(t=>(
        <div key={t.key} onClick={()=>onSelect(t.key)}
          style={{ display:"flex",alignItems:"center",gap:5,padding:"7px 14px",cursor:"pointer",borderBottom:`2px solid ${active===t.key?C.orange:"transparent"}`,background:active===t.key?C.white:"transparent",color:active===t.key?C.orange:C.sub,fontSize:12,fontWeight:active===t.key?700:500,whiteSpace:"nowrap",userSelect:"none",transition:"all 0.15s" }}>
          <span>{EMOJI[t.key]}</span>
          <span>{{ dashboard:"대시보드",village:"마을정보관리",sales:"마을기업 매출",subsidy:"보조금사업관리",board:"게시판" }[t.key]}</span>
          <button onClick={e=>{e.stopPropagation();onClose(t.key);}} style={{ background:"none",border:"none",cursor:"pointer",color:C.sub,marginLeft:2,padding:"0 2px",borderRadius:4,display:"flex",alignItems:"center" }}>
            <Ic d={I.close} size={11}/>
          </button>
        </div>
      ))}
    </div>
  );
}

function TopBar({ onMenuClick }) {
  return (
    <div style={{ height:52,background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 18px",gap:10,flexShrink:0 }}>
      <button onClick={onMenuClick} style={{ background:"none",border:"none",cursor:"pointer",color:C.sub,display:"flex",padding:6 }}>
        <Ic d={I.menu} size={20}/>
      </button>
      <div style={{ position:"relative",flex:1,maxWidth:300 }}>
        <div style={{ position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:C.sub }}><Ic d={I.search} size={14}/></div>
        <input placeholder="Search anything..." style={{ width:"100%",boxSizing:"border-box",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:50,padding:"7px 14px 7px 34px",fontSize:12,color:C.text,outline:"none" }}/>
      </div>
      <button style={{ background:C.text,color:"#fff",border:"none",borderRadius:10,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5 }}>
        <Ic d={I.plus} size={13} color="#fff"/> 등록
      </button>
      <button style={{ position:"relative",background:C.bg,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"7px",cursor:"pointer",display:"flex" }}>
        <Ic d={I.bell} size={17} color={C.sub}/>
        <span style={{ position:"absolute",top:5,right:5,width:6,height:6,background:C.orange,borderRadius:"50%",border:"1.5px solid #fff" }}/>
      </button>
      <div style={{ width:32,height:32,borderRadius:"50%",background:`linear-gradient(135deg,${C.orange},#FF8C42)`,display:"flex",alignItems:"center",justifyContent:"center" }}>
        <Ic d={I.user} size={15} color="#fff"/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PAGE
═══════════════════════════════════════════════════════════════ */
function LoginPage({ onLogin }) {
  const [id, setId]   = useState("");
  const [pw, setPw]   = useState("");
  const [err, setErr] = useState("");
  const go = () => { if (id==="admin"&&pw==="1234") onLogin(); else setErr("아이디 또는 비밀번호가 올바르지 않습니다."); };
  return (
    <div style={{ minHeight:"100vh",background:`linear-gradient(135deg,#FFF0EB,#fff,#FFF8F5)`,display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"'Noto Sans KR',sans-serif" }}>
      <div style={{ width:"100%",maxWidth:420 }}>
        <div style={{ textAlign:"center",marginBottom:36 }}>
          <div style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",width:58,height:58,background:C.orange,borderRadius:18,marginBottom:14,boxShadow:`0 8px 24px ${C.orangeM}` }}><span style={{ fontSize:28 }}>🌿</span></div>
          <div style={{ fontSize:24,fontWeight:800,color:C.text }}>완주군 마을포탈</div>
          <div style={{ fontSize:13,color:C.sub,marginTop:4 }}>Wanju Village Portal</div>
        </div>
        <div style={{ background:C.white,borderRadius:24,padding:32,boxShadow:"0 4px 40px rgba(0,0,0,0.08)",border:`1px solid ${C.border}` }}>
          <div style={{ fontSize:17,fontWeight:800,color:C.text,marginBottom:22 }}>관리자 로그인</div>
          <Field label="아이디" required><Input value={id} onChange={e=>{setId(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="admin"/></Field>
          <Field label="비밀번호" required><Input type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="••••••••"/></Field>
          {err&&<div style={{ fontSize:12,color:C.red,marginBottom:12 }}>{err}</div>}
          <BtnPrimary onClick={go} style={{ width:"100%",marginTop:4 }}>로그인</BtnPrimary>
          <p style={{ textAlign:"center",fontSize:12,color:C.sub,marginTop:20 }}>테스트 계정: <strong>admin</strong> / <strong>1234</strong></p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════════ */
export default function App() {
  const [step, setStep]       = useState("login");   // login | setup | app
  const [sb, setSb]           = useState(null);
  const [tabs, setTabs]       = useState([{ key:"dashboard" }]);
  const [active, setActive]   = useState("dashboard");
  const [drawer, setDrawer]   = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const toast = useToast();

  useEffect(() => {
    const h = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);

  // Tab management
  const openTab = (key) => {
    if (!tabs.find(t=>t.key===key)) setTabs(p=>[...p,{key}]);
    setActive(key);
  };
  const closeTab = (key) => {
    const next = tabs.filter(t=>t.key!==key);
    if (!next.length) { setTabs([{key:"dashboard"}]); setActive("dashboard"); return; }
    setTabs(next);
    if (active===key) setActive(next[next.length-1].key);
  };
  const handleLogout = () => { setStep("login"); setSb(null); setTabs([{key:"dashboard"}]); setActive("dashboard"); };

  // ── Pages ──
  const PAGE_PROPS = { sb, toast };
  const PAGES = {
    dashboard: <Dashboard {...PAGE_PROPS}/>,
    village:   <VillagePage {...PAGE_PROPS}/>,
    sales:     <SalesPage {...PAGE_PROPS}/>,
    subsidy:   <SubsidyPage {...PAGE_PROPS}/>,
    board:     <BoardPage {...PAGE_PROPS}/>,
  };

  const font = { fontFamily:"'Noto Sans KR', -apple-system, sans-serif" };

  if (step === "login") return (
    <div style={font}>
      <LoginPage onLogin={()=>setStep("setup")}/>
    </div>
  );
  if (step === "setup") return (
    <div style={font}>
      <SetupPage onConnect={(client)=>{ setSb(client); setStep("app"); }}/>
    </div>
  );

  /* ── MOBILE ── */
  if (isMobile) return (
    <div style={{ display:"flex",flexDirection:"column",height:"100vh",...font,background:C.bg }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}} @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <Toast toasts={toast.toasts}/>
      <div style={{ background:C.white,borderBottom:`1px solid ${C.border}`,padding:"0 16px",height:50,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          <div style={{ width:28,height:28,background:C.orange,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13 }}>🌿</div>
          <span style={{ fontSize:14,fontWeight:800,color:C.text }}>완주군 포탈</span>
          {!sb&&<span style={{ fontSize:9,background:C.orangeL,color:C.orange,borderRadius:4,padding:"1px 5px",fontWeight:700 }}>DEMO</span>}
        </div>
        <button onClick={handleLogout} style={{ background:"none",border:"none",cursor:"pointer",color:C.sub,display:"flex",alignItems:"center",gap:4,fontSize:12 }}>
          <Ic d={I.logout} size={16}/>
        </button>
      </div>
      <div style={{ flex:1,overflow:"hidden" }}>{PAGES[active]}</div>
      <div style={{ background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",padding:"6px 0 10px",flexShrink:0 }}>
        {NAV.map(n=>(
          <button key={n.key} onClick={()=>setActive(n.key)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2,border:"none",background:"none",cursor:"pointer",padding:"4px 2px" }}>
            <div style={{ width:34,height:34,borderRadius:12,background:active===n.key?C.orangeL:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.15s" }}>
              <Ic d={n.icon} size={17} color={active===n.key?C.orange:C.sub}/>
            </div>
            <span style={{ fontSize:9,fontWeight:active===n.key?700:500,color:active===n.key?C.orange:C.sub }}>{n.label.slice(0,5)}{n.label.length>5?"…":""}</span>
          </button>
        ))}
      </div>
    </div>
  );

  /* ── PC ── */
  return (
    <div style={{ display:"flex",height:"100vh",...font,background:C.bg,overflow:"hidden" }}>
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}} @keyframes slideIn{from{transform:translateX(20px);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
      <Toast toasts={toast.toasts}/>
      {/* Mobile drawer overlay */}
      {drawer&&<div onClick={()=>setDrawer(false)} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.4)",zIndex:40 }}/>}
      {drawer&&(
        <div style={{ position:"fixed",inset:"0 auto 0 0",zIndex:50,width:214,boxShadow:"4px 0 24px rgba(0,0,0,0.12)" }}>
          <Sidebar active={active} tabs={tabs} onNav={openTab} mobile onClose={()=>setDrawer(false)} onLogout={handleLogout} isDemo={!sb}/>
        </div>
      )}
      {/* Desktop sidebar */}
      <Sidebar active={active} tabs={tabs} onNav={openTab} onLogout={handleLogout} isDemo={!sb}/>
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden" }}>
        <TopBar onMenuClick={()=>setDrawer(true)}/>
        <TabBar tabs={tabs} active={active} onSelect={setActive} onClose={closeTab}/>
        <div style={{ flex:1,overflow:"hidden",background:C.bg }}>
          {tabs.map(t=>(
            <div key={t.key} style={{ height:"100%",display:active===t.key?"block":"none" }}>
              {PAGES[t.key]}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
