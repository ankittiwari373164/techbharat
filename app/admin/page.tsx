'use client'
import { useState, useEffect, useCallback } from 'react'
import SeoAnalyticsTab from '@/components/admin/SeoAnalyticsTab'

interface Article { id:string; slug:string; title:string; type:string; brand:string; publishDate:string; readTime:number; isFeatured:boolean; summary:string; tags:string[] }
interface Stats { total:number; mobileNews:number; reviews:number; compare:number; brands:Record<string,number> }
interface ScheduleSlot { index:number; type:string; label:string }
interface ScheduleStatus { todaySlots:ScheduleSlot[]; publishedToday:number; nextSlotLabel:string; allDoneToday:boolean; istNow:string }
interface StorySlide { id:string; headline:string; body:string; imageUrl:string; ctaText?:string; ctaLink?:string }
interface WebStory { id:string; slug:string; title:string; brand:string; category:string; coverImage:string; slides:StorySlide[]; publishDate:string; isPublished:boolean; tags:string[] }

type Tab = 'dashboard'|'schedule'|'articles'|'stories'|'fetch'|'images'|'seo'|'analytics'|'settings'

const typeColor:Record<string,string> = { 'mobile-news':'bg-blue-100 text-blue-800', 'review':'bg-red-100 text-red-800', 'compare':'bg-green-100 text-green-800' }
const statusColor:Record<string,string> = { ok:'bg-green-100 text-green-700', missing:'bg-red-100 text-red-700', unknown:'bg-gray-100 text-gray-500' }

const BRANDS = ['Samsung','Apple','Xiaomi','OnePlus','Realme','Vivo','OPPO','iQOO','Poco','Motorola','Nothing','Google Pixel','TechBharat']
const CATS   = ['Mobile News','Reviews','Compare','Flagship','Budget Phones','5G Phones']

function newSlide(): StorySlide { return { id: Date.now().toString(), headline:'', body:'', imageUrl:'', ctaText:'Read More', ctaLink:'' } }
function emptyStory() { return { title:'', brand:'TechBharat', category:'Mobile News', coverImage:'', tags:'', seoTitle:'', seoDescription:'', isPublished:true, slides:[newSlide()] as StorySlide[] } }

export default function AdminPage() {
  const [tab,setTab]                   = useState<Tab>('dashboard')
  const [articles,setArticles]         = useState<Article[]>([])
  const [articleViews,setArticleViews]  = useState<Record<string,number>>({})
  const [stats,setStats]               = useState<Stats|null>(null)
  const [schedule,setSchedule]         = useState<ScheduleStatus|null>(null)
  const [apiStatus,setApiStatus]       = useState<Record<string,string>>({})
  const [loading,setLoading]           = useState(false)
  // fetch
  const [fetchType,setFetchType]       = useState<'mobile-news'|'review'|'compare'>('mobile-news')
  const [fetchStatus,setFetchStatus]   = useState<'idle'|'running'|'done'|'error'>('idle')
  const [fetchLog,setFetchLog]         = useState<string[]>([])
  const [fetchResult,setFetchResult]   = useState<{title:string;slug:string}|null>(null)
  // articles mgmt
  const [search,setSearch]             = useState('')
  const [filterType,setFilterType]     = useState('all')
  const [filterBrand,setFilterBrand]   = useState('all')
  const [deleteId,setDeleteId]         = useState<string|null>(null)
  const [editArticle,setEditArticle]   = useState<Article|null>(null)
  // stories
  const [stories,setStories]           = useState<WebStory[]>([])
  const [storyForm,setStoryForm]       = useState(emptyStory())
  const [editStory,setEditStory]       = useState<WebStory|null>(null)
  const [deleteStoryId,setDeleteStoryId] = useState<string|null>(null)
  const [storySaving,setStorySaving]   = useState(false)
  const [storyMsg,setStoryMsg]         = useState('')
  // phone images
  const [phoneImages,setPhoneImages]   = useState<{name:string;slug:string;count:number}[]>([])
  // seo
  const [seoGsc,setSeoGsc]             = useState<{queries:unknown[];pages:unknown[];period:string}|null>(null)
  // ensure safe array access
  const gscQueries = (seoGsc?.queries || []) as Array<{keys:string[];clicks:number;impressions:number;position:number}>
  const gscPages   = (seoGsc?.pages   || []) as Array<{keys:string[];clicks:number;impressions:number;ctr:number}>
  const [seoTrends,setSeoTrends]       = useState<{title:string;traffic:string;link:string}[]>([])
  const [seoLoading,setSeoLoading]     = useState(false)
  const [seoMsg,setSeoMsg]             = useState('')
  const [seoMetaSlug,setSeoMetaSlug]   = useState('')
  const [seoMetaResult,setSeoMetaResult] = useState<Record<string,string>|null>(null)
  const [seoMissingMeta,setSeoMissingMeta] = useState<{slug:string;title:string}[]>([])
  const [indexLog,setIndexLog]         = useState<{url:string;status:string}[]>([])
  const [autoEgStatus,setAutoEgStatus] = useState<'idle'|'running'|'done'|'error'>('idle')
  const [autoEgMsg,setAutoEgMsg]       = useState('')

  const loadAll = useCallback(async () => {
    setLoading(true)
    try {
      const [artRes,statusRes,storiesRes] = await Promise.all([
        fetch('/api/admin/articles'),
        fetch('/api/admin/status'),
        fetch('/api/admin/stories'),
      ])
      if (artRes.status===401) { window.location.href='/admin/login'; return }
      const artData     = await artRes.json()
      const statusData  = await statusRes.json()
      const storiesData = await storiesRes.json()
      setArticles(artData.articles||[])
      // Load view counts
      fetch('/api/admin/views').then(r=>r.json()).then(d=>setArticleViews(d.views||{})).catch(()=>{})
      setStats(artData.stats||null)
      setSchedule(statusData.schedule||null)
      setApiStatus(statusData.keys||{})
      setStories(storiesData.stories||[])
    } catch { /**/ }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadAll()
    fetch('/api/phone-images').then(r=>r.json()).then(d=>setPhoneImages(d.phones||[])).catch(()=>{})
  }, [loadAll])

  useEffect(() => {
    const t = setInterval(()=>loadAll(), 2*60*1000)
    return ()=>clearInterval(t)
  }, [loadAll])

  // ── Fetch handler ─────────────────────────────────────────────
  const handleFetch = async () => {
    setFetchStatus('running'); setFetchLog([`Fetching 1 ${fetchType} article...`]); setFetchResult(null)
    try {
      const res  = await fetch('/api/admin/fetch',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({type:fetchType}) })
      const data = await res.json()
      if (data.success) { setFetchStatus('done'); setFetchLog(data.log||['Done']); setFetchResult(data.article); loadAll() }
      else { setFetchStatus('error'); setFetchLog([...(data.log||[]),data.error||'Unknown error']) }
    } catch { setFetchStatus('error'); setFetchLog(['Network error']) }
  }

  // ── Article handlers ──────────────────────────────────────────
  const handleDelete      = async (id:string) => { await fetch(`/api/admin/articles/${id}`,{method:'DELETE'}); setDeleteId(null); loadAll() }
  const handleToggleFeat  = async (id:string) => { await fetch(`/api/admin/articles/${id}/feature`,{method:'POST'}); loadAll() }
  const handleSaveEdit    = async () => { if(!editArticle)return; await fetch(`/api/admin/articles/${editArticle.id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(editArticle)}); setEditArticle(null); loadAll() }

  // ── Story handlers ────────────────────────────────────────────
  const handleSaveStory = async () => {
    if (!storyForm.title || storyForm.slides.every(s=>!s.headline)) { setStoryMsg('❌ Title and at least one headline required'); return }
    setStorySaving(true); setStoryMsg('')
    try {
      const payload = { ...storyForm, tags: storyForm.tags.split(',').map((t:string)=>t.trim()).filter(Boolean) }
      const url     = editStory ? `/api/admin/stories/${editStory.id}` : '/api/admin/stories'
      const method  = editStory ? 'PUT' : 'POST'
      const res     = await fetch(url,{method,headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      const data    = await res.json()
      if (data.success || data.story) {
        setStoryMsg('✅ Story saved!')
        setStoryForm(emptyStory())
        setEditStory(null)
        loadAll()
      } else { setStoryMsg('❌ '+(data.error||'Save failed')) }
    } catch { setStoryMsg('❌ Network error') }
    setStorySaving(false)
  }

  const handleEditStory = (s:WebStory) => {
    setEditStory(s)
    setStoryForm({ title:s.title, brand:s.brand, category:s.category, coverImage:s.coverImage, tags:(s.tags||[]).join(', '), seoTitle:'', seoDescription:'', isPublished:s.isPublished, slides:s.slides })
    setTab('stories')
    setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),100)
  }

  const handleDeleteStory = async (id:string) => { await fetch(`/api/admin/stories/${id}`,{method:'DELETE'}); setDeleteStoryId(null); loadAll() }
  const handleTogglePublish = async (id:string) => { await fetch(`/api/admin/stories/${id}`,{method:'PATCH'}); loadAll() }

  // slide helpers
  const addSlide    = () => setStoryForm(f=>({...f,slides:[...f.slides,newSlide()]}))
  const removeSlide = (i:number) => setStoryForm(f=>({...f,slides:f.slides.filter((_,j)=>j!==i)}))
  const updateSlide = (i:number, field:keyof StorySlide, val:string) => setStoryForm(f=>({...f,slides:f.slides.map((s,j)=>j===i?{...s,[field]:val}:s)}))
  const moveSlide   = (i:number, dir:-1|1) => {
    const j = i+dir
    if (j<0||j>=storyForm.slides.length) return
    const s=[...storyForm.slides]; [s[i],s[j]]=[s[j],s[i]]; setStoryForm(f=>({...f,slides:s}))
  }

  const handleLogout = async () => { await fetch('/api/admin/logout',{method:'POST'}); window.location.href='/admin/login' }

  const filtered = articles.filter(a=>{
    return (search===''||a.title.toLowerCase().includes(search.toLowerCase())||a.brand.toLowerCase().includes(search.toLowerCase()))
      && (filterType==='all'||a.type===filterType) && (filterBrand==='all'||a.brand===filterBrand)
  })
  const allBrands = Array.from(new Set(articles.map(a=>a.brand))).sort()
  const pubDate   = (iso:string)=>new Date(iso).toLocaleDateString('en-IN',{day:'numeric',month:'short'})

  const NAV = [
    {id:'dashboard' as Tab,icon:'📊',label:'Dashboard'},
    {id:'schedule'  as Tab,icon:'⏰',label:'Schedule'},
    {id:'fetch'     as Tab,icon:'🔄',label:'Publish Now'},
    {id:'articles'  as Tab,icon:'📰',label:'Articles'},
    {id:'stories'   as Tab,icon:'📖',label:'Web Stories'},
    {id:'images'    as Tab,icon:'🖼️',label:'Phone Images'},
    {id:'seo'       as Tab,icon:'🔍',label:'SEO Tools'},
    {id:'analytics' as Tab,icon:'📈',label:'Analytics'},
    {id:'settings'  as Tab,icon:'🔧',label:'Settings'},
  ]

  return (
    <div className="min-h-screen bg-gray-50" style={{fontFamily:'system-ui,sans-serif'}}>
      {/* Header */}
      <div className="bg-[#0d0d0d] text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="The Tech Bharat" style={{height:"32px",width:"32px",borderRadius:"50%",objectFit:"cover"}} /><span className="text-[#d4220a] font-black text-lg ml-2" style={{fontFamily:"serif"}}>The Tech<span className="text-white"> Bharat</span></span>
            <span className="text-gray-600 text-xs">/ Admin</span>
          </div>
          <div className="flex items-center gap-4">
            {schedule && <span className="text-xs text-gray-500 hidden sm:block">🕐 {schedule.istNow}</span>}
            <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-white">↗ Site</a>
            <button onClick={handleLogout} className="text-xs text-gray-400 hover:text-red-400 border border-gray-700 px-2.5 py-1 rounded">Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 flex gap-5">
        {/* Sidebar */}
        <aside className="w-48 flex-shrink-0 space-y-3">
          <nav className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {NAV.map(item=>(
              <button key={item.id} onClick={()=>setTab(item.id)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium border-b border-gray-50 last:border-0 transition-colors ${tab===item.id?'bg-[#d4220a] text-white':'text-gray-700 hover:bg-gray-50'}`}>
                <span className="w-4">{item.icon}</span>{item.label}
              </button>
            ))}
          </nav>
          {stats && (
            <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm space-y-1.5">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Stats</p>
              {[['Total',stats.total],['News',stats.mobileNews],['Reviews',stats.reviews],['Stories',stories.length]].map(([l,v])=>(
                <div key={l} className="flex justify-between"><span className="text-xs text-gray-500">{l}</span><span className="text-xs font-bold text-gray-800">{v}</span></div>
              ))}
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">APIs</p>
            {[['NewsAPI','newsapi'],['GNews','gnews'],['Anthropic','anthropic'],['Groq','groq']].map(([label,key])=>(
              <div key={key} className="flex justify-between items-center mb-1.5">
                <span className="text-[11px] text-gray-500">{label}</span>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${statusColor[apiStatus[key]||'unknown']}`}>{apiStatus[key]==='ok'?'✓':apiStatus[key]==='missing'?'✗':'?'}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">

          {/* ── DASHBOARD ── */}
          {tab==='dashboard' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                <button onClick={loadAll} className="text-xs text-gray-400 hover:text-gray-700">↻ Refresh</button>
              </div>
              {schedule && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-700">📅 Today's Schedule</h2>
                    <span className="text-xs bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">{schedule.publishedToday}/5 published</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {schedule.todaySlots.map((slot,i)=>{
                      const done=i<schedule.publishedToday, next=i===schedule.publishedToday
                      return (
                        <div key={i} className={`rounded-lg p-2.5 text-center border ${done?'bg-green-50 border-green-200':next?'bg-amber-50 border-amber-300 ring-1 ring-amber-300':'bg-gray-50 border-gray-200'}`}>
                          <div className="text-lg mb-0.5">{done?'✅':next?'⏳':'○'}</div>
                          <p className="text-[10px] font-bold text-gray-600">{slot.label}</p>
                          <p className={`text-[9px] mt-0.5 font-medium ${slot.type==='review'?'text-red-600':slot.type==='compare'?'text-green-600':'text-blue-600'}`}>
                            {slot.type==='mobile-news'?'News':slot.type==='review'?'Review':'Compare'}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                  {!schedule.allDoneToday && <p className="text-xs text-gray-400 mt-3 text-center">Next: <strong className="text-gray-600">{schedule.nextSlotLabel}</strong></p>}
                </div>
              )}
              {stats && (
                <div className="grid grid-cols-4 gap-3">
                  {[{l:'Articles',v:stats.total,c:'bg-gray-800'},{l:'News',v:stats.mobileNews,c:'bg-blue-600'},{l:'Reviews',v:stats.reviews,c:'bg-red-600'},{l:'Stories',v:stories.length,c:'bg-purple-600'}].map(s=>(
                    <div key={s.l} className={`rounded-xl p-4 ${s.c} text-white`}><p className="text-2xl font-black">{s.v}</p><p className="text-xs opacity-80 mt-0.5">{s.l}</p></div>
                  ))}
                </div>
              )}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between">
                  <h2 className="text-sm font-bold text-gray-700">Recent Articles</h2>
                  <button onClick={()=>setTab('articles')} className="text-xs text-[#d4220a] hover:underline">View all →</button>
                </div>
                {articles.slice(0,6).map(a=>(
                  <div key={a.id} className="px-4 py-2.5 border-b border-gray-50 last:border-0 flex items-center justify-between">
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 truncate">{a.title}</p><p className="text-xs text-gray-400 mt-0.5">{a.brand} · {pubDate(a.publishDate)}</p></div>
                    <span className={`ml-3 text-[10px] font-bold px-2 py-0.5 rounded flex-shrink-0 ${typeColor[a.type]||'bg-gray-100 text-gray-600'}`}>{a.type}</span>
                  </div>
                ))}
                {articles.length===0 && <div className="px-4 py-8 text-center text-gray-400 text-sm">No articles yet.</div>}
              </div>
            </div>
          )}

          {/* ── SCHEDULE ── */}
          {tab==='schedule' && (
            <div className="space-y-4">
              <h1 className="text-lg font-bold text-gray-900">Publishing Schedule</h1>
              {schedule && (
                <>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-sm font-bold text-gray-700">Today — {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</h2>
                      <span className="text-xs text-gray-400">{schedule.istNow}</span>
                    </div>
                    <div className="space-y-3">
                      {schedule.todaySlots.map((slot,i)=>{
                        const done=i<schedule.publishedToday, next=i===schedule.publishedToday&&!schedule.allDoneToday
                        return (
                          <div key={i} className={`flex items-center gap-4 p-3 rounded-lg border ${done?'bg-green-50 border-green-200':next?'bg-amber-50 border-amber-300':'bg-gray-50 border-gray-200'}`}>
                            <div className="text-xl w-8 text-center flex-shrink-0">{done?'✅':next?'⏳':`${i+1}`}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-gray-800">{slot.label}</span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeColor[slot.type]||'bg-gray-100 text-gray-600'}`}>{slot.type}</span>
                                {done && <span className="text-xs text-green-600 font-medium">Published</span>}
                                {next && <span className="text-xs text-amber-600 font-medium animate-pulse">Up next</span>}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {!schedule.allDoneToday && <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700"><strong>Next auto-publish:</strong> {schedule.nextSlotLabel}</div>}
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <h2 className="text-sm font-bold text-gray-700 mb-2">🔧 Vercel Cron Setup</h2>
                    <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-auto">{`{\n  "crons": [{ "path": "/api/scheduler", "schedule": "*/30 * * * *" }]\n}`}</pre>
                    <p className="text-xs text-gray-400 mt-2">Runs every 30 min, publishes only when a slot is due.</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── PUBLISH NOW ── */}
          {tab==='fetch' && (
            <div className="space-y-4">
              <h1 className="text-lg font-bold text-gray-900">Publish Now</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-1">Manual Publish</h2>
                <p className="text-xs text-gray-500 mb-4">Fetch and publish one article immediately outside of the auto-schedule.</p>
                <div className="mb-4">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Article Type</label>
                  <div className="flex gap-2">
                    {(['mobile-news','review','compare'] as const).map(t=>(
                      <button key={t} onClick={()=>setFetchType(t)} className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${fetchType===t?'bg-[#1a3a5c] text-white border-[#1a3a5c]':'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}>
                        {t==='mobile-news'?'📱 News':t==='review'?'⭐ Review':'⚖️ Compare'}
                      </button>
                    ))}
                  </div>
                </div>
                {fetchStatus==='idle' && <button onClick={handleFetch} className="bg-[#d4220a] hover:bg-[#b81d09] text-white font-bold px-6 py-2.5 rounded-lg text-sm">🔄 Fetch & Publish Now</button>}
                {fetchStatus==='running' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-[#d4220a] border-t-transparent rounded-full animate-spin"/><span className="text-sm text-gray-600">Fetching…</span></div>
                    <div className="bg-gray-900 rounded-lg p-3 font-mono text-xs text-green-400 space-y-1 max-h-32 overflow-y-auto">{fetchLog.map((l,i)=><p key={i}>{l}</p>)}<p className="animate-pulse">▌</p></div>
                  </div>
                )}
                {fetchStatus==='done' && fetchResult && (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4"><p className="font-bold text-green-800 text-sm mb-1">✅ Published!</p><p className="text-xs text-green-700 mb-2">{fetchResult.title}</p><a href={`/${fetchResult.slug}`} target="_blank" className="text-xs text-[#d4220a] hover:underline font-medium">View article →</a></div>
                    <button onClick={()=>{setFetchStatus('idle');setFetchLog([]);setFetchResult(null)}} className="bg-[#d4220a] text-white text-sm font-bold px-4 py-2 rounded-lg">Publish Another</button>
                  </div>
                )}
                {fetchStatus==='error' && (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4"><p className="font-bold text-red-800 text-sm mb-1">⚠️ Failed</p>{fetchLog.map((l,i)=><p key={i} className="text-xs text-red-700">{l}</p>)}</div>
                    <button onClick={()=>{setFetchStatus('idle');setFetchLog([])}} className="bg-[#d4220a] text-white text-sm font-bold px-4 py-2 rounded-lg">Try Again</button>
                  </div>
                )}
              </div>

              {/* ── EVERGREEN TRENDING FETCH ── */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-1">🌿 Evergreen Article</h2>
                <p className="text-xs text-gray-500 mb-4">Checks today&apos;s Google Trends India and publishes the best matching unpublished evergreen article.</p>
                {autoEgStatus==='idle' && (
                  <button onClick={async()=>{
                    setAutoEgStatus('running')
                    setAutoEgMsg('')
                    try {
                      const r=await fetch('/api/admin/generate-evergreen?auto=1',{method:'POST'})
                      const d=await r.json()
                      if(d.message?.includes('All evergreen')){
                        setAutoEgStatus('done')
                        setAutoEgMsg('All 10 evergreen articles already published ✅')
                      } else if(d.errors?.length){
                        setAutoEgStatus('error')
                        setAutoEgMsg(d.errors[0])
                      } else {
                        setAutoEgStatus('done')
                        setAutoEgMsg(`Published: ${d.generated?.[0]||'article'}`)
                        loadAll()
                      }
                    } catch {
                      setAutoEgStatus('error')
                      setAutoEgMsg('Network error — try again')
                    }
                  }} className="bg-[#1a3a5c] hover:bg-[#0f2a48] text-white font-bold px-6 py-2.5 rounded-lg text-sm">
                    🌿 Fetch &amp; Publish Trending Evergreen
                  </button>
                )}
                {autoEgStatus==='running' && (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#1a3a5c] border-t-transparent rounded-full animate-spin"/>
                    <span className="text-sm text-gray-600">Checking trends &amp; generating article…</span>
                  </div>
                )}
                {(autoEgStatus==='done'||autoEgStatus==='error') && (
                  <div className="space-y-3">
                    <div className={`rounded-lg p-4 border ${autoEgStatus==='done'?'bg-green-50 border-green-200':'bg-red-50 border-red-200'}`}>
                      <p className={`text-sm font-medium ${autoEgStatus==='done'?'text-green-800':'text-red-800'}`}>{autoEgStatus==='done'?'✅ ':''}{autoEgMsg}</p>
                    </div>
                    <button onClick={()=>{setAutoEgStatus('idle');setAutoEgMsg('')}} className="bg-[#1a3a5c] text-white text-sm font-bold px-4 py-2 rounded-lg">
                      {autoEgStatus==='error'?'↺ Retry':'Publish Another'}
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ── ARTICLES ── */}
          {tab==='articles' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900">Articles ({filtered.length})</h1><button onClick={loadAll} className="text-xs text-[#d4220a] hover:underline">↻ Refresh</button></div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-wrap gap-2 shadow-sm">
                <input type="text" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)} className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg outline-none focus:border-[#1a3a5c] flex-1 min-w-32"/>
                <select value={filterType} onChange={e=>setFilterType(e.target.value)} className="text-sm border border-gray-200 px-2 py-1.5 rounded-lg outline-none bg-white">
                  <option value="all">All Types</option><option value="mobile-news">News</option><option value="review">Review</option><option value="compare">Compare</option>
                </select>
                <select value={filterBrand} onChange={e=>setFilterBrand(e.target.value)} className="text-sm border border-gray-200 px-2 py-1.5 rounded-lg outline-none bg-white">
                  <option value="all">All Brands</option>{allBrands.map(b=><option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr><th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Brand</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Type</th><th className="text-left px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Date</th><th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-16">👁 Views</th><th className="text-center px-3 py-3 text-xs font-semibold text-gray-500 uppercase w-10">★</th><th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Actions</th></tr>
                  </thead>
                  <tbody>
                    {filtered.map(a=>(
                      <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="px-4 py-2.5"><a href={`/${a.slug}`} target="_blank" className="font-medium text-gray-800 hover:text-[#d4220a] line-clamp-1 text-sm">{a.title}</a></td>
                        <td className="px-3 py-2.5 text-xs text-gray-500">{a.brand}</td>
                        <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded ${typeColor[a.type]||'bg-gray-100 text-gray-600'}`}>{a.type}</span></td>
                        <td className="px-3 py-2.5 text-xs text-gray-400">{pubDate(a.publishDate)}</td>
                        <td className="px-3 py-2.5 text-center"><span className="text-xs font-semibold text-gray-700">{(articleViews[a.slug]||0).toLocaleString()}</span></td>
                        <td className="px-3 py-2.5 text-center"><button onClick={()=>handleToggleFeat(a.id)} className={`text-base ${a.isFeatured?'opacity-100':'opacity-20 hover:opacity-50'}`}>⭐</button></td>
                        <td className="px-4 py-2.5 text-right"><div className="flex items-center justify-end gap-2"><button onClick={()=>setEditArticle(a)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button><a href={`/${a.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-gray-600">View</a><button onClick={()=>setDeleteId(a.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Del</button></div></td>
                      </tr>
                    ))}
                    {filtered.length===0 && <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 text-sm">No articles.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── WEB STORIES ── */}
          {tab==='stories' && (
            <div className="space-y-5">
              <h1 className="text-lg font-bold text-gray-900">Web Stories</h1>

              {/* CREATE / EDIT FORM */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-4">{editStory ? '✏️ Edit Story' : '➕ Create New Story'}</h2>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Story Title *</label>
                    <input type="text" value={storyForm.title} onChange={e=>setStoryForm(f=>({...f,title:e.target.value}))} placeholder="e.g. Samsung Galaxy S25 Ultra — 5 Things You Need to Know" className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#d4220a]"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Brand</label>
                    <select value={storyForm.brand} onChange={e=>setStoryForm(f=>({...f,brand:e.target.value}))} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none bg-white">
                      {BRANDS.map(b=><option key={b}>{b}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Category</label>
                    <select value={storyForm.category} onChange={e=>setStoryForm(f=>({...f,category:e.target.value}))} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none bg-white">
                      {CATS.map(c=><option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Cover Image URL <span className="text-gray-400 font-normal normal-case">(9:16 portrait — appears in stories grid)</span></label>
                    <input type="text" value={storyForm.coverImage} onChange={e=>setStoryForm(f=>({...f,coverImage:e.target.value}))} placeholder="https://images.unsplash.com/... or /phone-images/samsung-s25/1.jpg" className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none focus:border-[#d4220a]"/>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Tags <span className="text-gray-400 font-normal normal-case">(comma separated)</span></label>
                    <input type="text" value={storyForm.tags} onChange={e=>setStoryForm(f=>({...f,tags:e.target.value}))} placeholder="Samsung, Galaxy S25, Flagship 2025" className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none"/>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="pub" checked={storyForm.isPublished} onChange={e=>setStoryForm(f=>({...f,isPublished:e.target.checked}))} className="w-4 h-4 accent-[#d4220a]"/>
                    <label htmlFor="pub" className="text-sm text-gray-700">Publish immediately (visible on site)</label>
                  </div>
                </div>

                {/* Slides */}
                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-gray-700">📋 Slides ({storyForm.slides.length})</h3>
                    <button onClick={addSlide} className="text-xs bg-[#1a3a5c] text-white px-3 py-1.5 rounded-lg font-medium hover:bg-[#0f2d4a]">+ Add Slide</button>
                  </div>

                  <div className="space-y-4">
                    {storyForm.slides.map((slide,i)=>(
                      <div key={slide.id} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-bold text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">Slide {i+1}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={()=>moveSlide(i,-1)} disabled={i===0} className="text-xs text-gray-400 hover:text-gray-700 px-1.5 py-1 border border-gray-200 rounded disabled:opacity-30 bg-white">↑</button>
                            <button onClick={()=>moveSlide(i,1)} disabled={i===storyForm.slides.length-1} className="text-xs text-gray-400 hover:text-gray-700 px-1.5 py-1 border border-gray-200 rounded disabled:opacity-30 bg-white">↓</button>
                            {storyForm.slides.length>1 && <button onClick={()=>removeSlide(i)} className="text-xs text-red-500 hover:text-red-700 px-1.5 py-1 border border-red-200 rounded bg-white">✕</button>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2">
                            <label className="text-xs text-gray-500 block mb-1">Background Image URL *</label>
                            <input type="text" value={slide.imageUrl} onChange={e=>updateSlide(i,'imageUrl',e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full text-xs border border-gray-200 px-2.5 py-2 rounded-lg outline-none focus:border-[#d4220a] bg-white"/>
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-gray-500 block mb-1">Headline * <span className="text-gray-400">(bold text — keep under 60 chars)</span></label>
                            <input type="text" value={slide.headline} onChange={e=>updateSlide(i,'headline',e.target.value)} placeholder="Samsung S25 Ultra Gets 200MP Camera" className="w-full text-xs border border-gray-200 px-2.5 py-2 rounded-lg outline-none focus:border-[#d4220a] bg-white"/>
                          </div>
                          <div className="col-span-2">
                            <label className="text-xs text-gray-500 block mb-1">Body Text <span className="text-gray-400">(supporting detail — 1–2 lines)</span></label>
                            <textarea rows={2} value={slide.body} onChange={e=>updateSlide(i,'body',e.target.value)} placeholder="The new 200MP sensor captures incredible detail even in low light." className="w-full text-xs border border-gray-200 px-2.5 py-2 rounded-lg outline-none resize-none bg-white"/>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">CTA Button Text</label>
                            <input type="text" value={slide.ctaText||''} onChange={e=>updateSlide(i,'ctaText',e.target.value)} placeholder="Read More" className="w-full text-xs border border-gray-200 px-2.5 py-2 rounded-lg outline-none bg-white"/>
                          </div>
                          <div>
                            <label className="text-xs text-gray-500 block mb-1">CTA Link</label>
                            <input type="text" value={slide.ctaLink||''} onChange={e=>updateSlide(i,'ctaLink',e.target.value)} placeholder="/article/samsung-s25-review" className="w-full text-xs border border-gray-200 px-2.5 py-2 rounded-lg outline-none bg-white"/>
                          </div>
                        </div>
                        {/* Slide preview */}
                        {slide.imageUrl && (
                          <div className="mt-3 relative overflow-hidden rounded-lg" style={{paddingBottom:'56%'}}>
                            <img src={slide.imageUrl} alt="preview" className="absolute inset-0 w-full h-full object-cover" onError={e=>(e.currentTarget.style.display='none')}/>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-3">
                              {slide.headline && <p className="text-white text-xs font-bold leading-tight">{slide.headline}</p>}
                              {slide.body && <p className="text-white/70 text-[10px] mt-1 leading-tight">{slide.body}</p>}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save */}
                {storyMsg && <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${storyMsg.startsWith('✅')?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>{storyMsg}</div>}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button onClick={handleSaveStory} disabled={storySaving} className="bg-[#d4220a] hover:bg-[#b81d09] disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-lg text-sm">
                    {storySaving?'Saving…':editStory?'Update Story':'Publish Story'}
                  </button>
                  {editStory && <button onClick={()=>{setEditStory(null);setStoryForm(emptyStory());setStoryMsg('')}} className="text-sm text-gray-500 border border-gray-200 px-4 py-2.5 rounded-lg hover:bg-gray-50">Cancel Edit</button>}
                </div>
              </div>

              {/* STORIES LIST */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-sm font-bold text-gray-700">All Stories ({stories.length})</h2>
                  <a href="/web-stories" target="_blank" className="text-xs text-[#d4220a] hover:underline">View on site →</a>
                </div>
                {stories.length===0 ? (
                  <div className="px-4 py-10 text-center text-gray-400 text-sm">No stories yet. Create your first one above.</div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {stories.map(s=>(
                      <div key={s.id} className="px-4 py-3 flex items-center gap-3">
                        {/* Cover thumbnail */}
                        {s.coverImage ? (
                          <div className="w-10 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={s.coverImage} alt={s.title} className="w-full h-full object-cover"/>
                          </div>
                        ) : (
                          <div className="w-10 h-16 rounded-lg bg-gray-200 flex-shrink-0 flex items-center justify-center text-gray-400 text-lg">📖</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 truncate">{s.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{s.brand} · {s.slides.length} slides · {pubDate(s.publishDate)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.isPublished?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>
                              {s.isPublished?'● Live':'○ Draft'}
                            </span>
                            <span className="text-[10px] text-gray-400">{s.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={()=>handleTogglePublish(s.id)} className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium ${s.isPublished?'border-amber-200 text-amber-700 hover:bg-amber-50':'border-green-200 text-green-700 hover:bg-green-50'}`}>
                            {s.isPublished?'Unpublish':'Publish'}
                          </button>
                          <button onClick={()=>handleEditStory(s)} className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2.5 py-1.5 border border-blue-200 rounded-lg">Edit</button>
                          <a href={`/web-stories/${s.slug}`} target="_blank" className="text-xs text-gray-400 hover:text-gray-600 px-2.5 py-1.5 border border-gray-200 rounded-lg">View</a>
                          <button onClick={()=>setDeleteStoryId(s.id)} className="text-xs text-red-500 hover:text-red-700 px-2.5 py-1.5 border border-red-200 rounded-lg">Del</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PHONE IMAGES ── */}
          {tab==='images' && (
            <div className="space-y-4">
              <h1 className="text-lg font-bold text-gray-900">Phone Images</h1>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">Drop images into <code className="bg-blue-100 px-1 rounded">public/phone-images/brand-model/</code> named <code className="bg-blue-100 px-1 rounded">1.jpg</code>, <code className="bg-blue-100 px-1 rounded">2.jpg</code> etc.</div>
              {phoneImages.length===0 ? <div className="bg-white rounded-xl border border-gray-200 p-8 text-center shadow-sm"><p className="text-gray-400 text-sm">No phone images yet.</p></div> : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {phoneImages.map(p=>(
                    <div key={p.slug} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center">
                      <p className="text-2xl mb-1">📱</p>
                      <p className="text-xs font-semibold text-gray-800 capitalize leading-tight">{p.name}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{p.count} img{p.count!==1?'s':''}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── SEO TOOLS ── */}
          {tab==='seo' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-lg font-bold text-gray-900">🔍 SEO Automation Hub</h1>
                  <p className="text-xs text-gray-400 mt-0.5">Auto-refreshes every 20 hours using Google Trends India</p>
                </div>
                <button onClick={async()=>{
                  setSeoLoading(true); setSeoMsg('Running full SEO refresh...')
                  const r=await fetch(`/api/seo-cron?secret=${encodeURIComponent(process.env.NEXT_PUBLIC_CRON_SECRET||'')}&force=1`)
                  const d=await r.json()
                  setSeoMsg(d.log?.[d.log.length-1]||'Done'); setSeoLoading(false)
                }} disabled={seoLoading} className="bg-[#d4220a] text-white text-xs font-bold px-4 py-2 rounded-lg disabled:opacity-50">
                  ⚡ Force Full Refresh Now
                </button>
              </div>

              {seoMsg && <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm px-4 py-2.5 rounded-lg">{seoMsg}</div>}

              {/* ── QUICK ACTIONS ── */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {label:'📊 Load GSC Traffic',action:async()=>{
                    setSeoLoading(true); setSeoMsg('')
                    const r=await fetch('/api/seo?action=gsc&days=28'); const d=await r.json()
                    setSeoLoading(false)
                    if(d.error) { setSeoMsg(`GSC Error: ${d.error}`); return }
                    setSeoGsc({ queries: d.queries||[], pages: d.pages||[], period: d.period||'' })
                    setSeoMsg(`Loaded ${(d.queries||[]).length} queries, ${(d.pages||[]).length} pages`)
                  }},
                  {label:'📈 India Trends',action:async()=>{
                    setSeoLoading(true); setSeoMsg('')
                    const r=await fetch('/api/seo?action=trends'); const d=await r.json()
                    setSeoTrends(d.trends||[]); setSeoLoading(false)
                    setSeoMsg(`Loaded ${(d.trends||[]).length} trending topics`)
                  }},
                  {label:'🏷️ Find Missing Meta',action:async()=>{
                    setSeoLoading(true); setSeoMsg('')
                    const r=await fetch('/api/seo?action=meta_batch'); const d=await r.json()
                    setSeoMissingMeta(d.missing||[]); setSeoLoading(false)
                    setSeoMsg(`${(d.missing||[]).length} of ${d.total} articles missing SEO meta`)
                  }},
                  {label:'🤖 Auto-Fix All Meta',action:async()=>{
                    if(!confirm('Generate AI SEO meta for all articles missing it? (max 30)')) return
                    setSeoLoading(true); setSeoMsg('Generating...')
                    const r=await fetch('/api/seo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'generate_all_meta',force:true})})
                    const d=await r.json()
                    setSeoMsg(`✅ Generated meta for ${d.generated} articles (${d.skipped||0} skipped, ${d.total||0} total)`); setSeoLoading(false)
                  }},
                ].map(btn=>(
                  <button key={btn.label} onClick={btn.action} disabled={seoLoading}
                    className="bg-[#1a3a5c] text-white text-xs font-bold px-3 py-3 rounded-lg hover:bg-[#0f2a48] disabled:opacity-50 text-center leading-tight">
                    {btn.label}
                  </button>
                ))}
              </div>

              {/* ── AUTOMATION STATUS ── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">🔄 Auto-Refresh Cycle</h3>
                  <p className="text-2xl font-black text-[#d4220a]">20h</p>
                  <p className="text-xs text-gray-500 mt-1">All pages + articles updated every 20 hours with fresh Google Trends keywords</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">🤖 What Auto-Updates</h3>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✅ Home, Mobile News, Reviews, Compare pages</li>
                    <li>✅ All article SEO titles + descriptions</li>
                    <li>✅ Focus keywords from trending topics</li>
                    <li>✅ Google indexing for new articles</li>
                  </ul>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">📋 UptimeRobot Setup</h3>
                  <p className="text-xs text-gray-600 mb-2">Add this monitor (free):</p>
                  <code className="text-[10px] bg-gray-100 px-2 py-1 rounded block break-all text-gray-700">
                    thetechbharat.com/api/seo-cron?secret=YOUR_CRON_SECRET
                  </code>
                  <p className="text-[10px] text-gray-400 mt-1">Interval: 60 min</p>
                </div>
              </div>

              {/* ── GSC TRAFFIC ── */}
              {seoGsc && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-gray-800">🔍 Top Search Queries</h2>
                      <span className="text-[10px] text-gray-400">{seoGsc.period}</span>
                    </div>
                    {gscQueries.length===0
                      ? <p className="text-xs text-gray-400 italic p-3 bg-blue-50 rounded-lg">✅ GSC connected — no search clicks yet. Data appears after Google indexes your articles and users click them (usually 7-14 days for new sites).</p>
                      : <>
                          <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase px-2 pb-2">
                            <span className="col-span-6">Query</span><span className="col-span-2 text-center">Clicks</span><span className="col-span-2 text-center">Impr.</span><span className="col-span-2 text-center">Pos.</span>
                          </div>
                          {gscQueries.map((row,i)=>(
                            <div key={i} className="grid grid-cols-12 text-xs px-2 py-1.5 rounded hover:bg-gray-50 border-b border-gray-50">
                              <span className="col-span-6 text-gray-700 truncate">{row.keys[0]}</span>
                              <span className="col-span-2 text-center text-green-600 font-bold">{row.clicks}</span>
                              <span className="col-span-2 text-center text-gray-400">{row.impressions}</span>
                              <span className="col-span-2 text-center text-blue-500">#{row.position?.toFixed(1)}</span>
                            </div>
                          ))}
                        </>
                    }
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-bold text-gray-800">📄 Top Pages</h2>
                      <span className="text-[10px] text-gray-400">{seoGsc.period}</span>
                    </div>
                    {gscPages.length===0
                      ? <p className="text-xs text-gray-400 italic p-3 bg-blue-50 rounded-lg">✅ GSC connected — page impressions will appear once Google starts showing your pages in search results.</p>
                      : <>
                          <div className="grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase px-2 pb-2">
                            <span className="col-span-7">Page</span><span className="col-span-2 text-center">Clicks</span><span className="col-span-3 text-center">CTR</span>
                          </div>
                          {gscPages.map((row,i)=>(
                            <div key={i} className="grid grid-cols-12 text-xs px-2 py-1.5 rounded hover:bg-gray-50 border-b border-gray-50">
                              <span className="col-span-7 text-gray-700 truncate">{row.keys[0].replace('https://thetechbharat.com','') || '/'}</span>
                              <span className="col-span-2 text-center text-green-600 font-bold">{row.clicks}</span>
                              <span className="col-span-3 text-center text-blue-500">{(row.ctr*100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </>
                    }
                  </div>
                </div>
              )}

              {/* ── GOOGLE TRENDS ── */}
              {seoTrends.length>0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="text-sm font-bold text-gray-800 mb-1">📈 Trending in India Right Now</h2>
                  <p className="text-xs text-gray-400 mb-3">These keywords are auto-injected into your page metadata every 20 hours</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {seoTrends.map((t,i)=>(
                      <a key={i} href={`https://news.google.com/search?q=${encodeURIComponent(t.title)}+smartphone`} target="_blank" rel="noopener"
                        className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-blue-50 group">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-[10px] text-gray-400 font-bold shrink-0">{i+1}</span>
                          <span className="text-xs text-gray-800 font-medium truncate group-hover:text-blue-700">{t.title}</span>
                        </div>
                        {t.traffic && <span className="text-[10px] text-green-600 font-bold ml-1 shrink-0">{t.traffic}</span>}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* ── GOOGLE INDEXING ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-1">⚡ Google Indexing API</h2>
                <p className="text-xs text-gray-500 mb-3">New articles are auto-submitted to Google every hour. Use manual submit if you want to force-index all articles now.</p>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={async()=>{
                    if(!confirm('Submit ALL articles to Google? (200/day limit)')) return
                    setSeoLoading(true); setSeoMsg('Submitting to Google...')
                    const r=await fetch('/api/seo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'index_all'})})
                    const d=await r.json()
                    setIndexLog(d.results||[])
                    setSeoMsg(`✅ Submitted ${d.submitted} URLs to Google`); setSeoLoading(false)
                  }} disabled={seoLoading} className="bg-[#d4220a] text-white text-xs font-bold px-4 py-2 rounded-lg hover:opacity-80 disabled:opacity-50">
                    📤 Submit All Articles to Google
                  </button>
                  <button onClick={async()=>{
                    setSeoLoading(true)
                    const r=await fetch('/api/seo?action=index_status'); const d=await r.json()
                    if(d.lastBatch?.results) setIndexLog(d.lastBatch.results)
                    setSeoLoading(false); setSeoMsg('Loaded last batch results')
                  }} disabled={seoLoading} className="border border-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-gray-50">
                    📋 View Last Batch
                  </button>
                </div>
                {indexLog.length>0 && (
                  <div className="mt-3 max-h-36 overflow-y-auto space-y-1 p-2 bg-gray-50 rounded-lg">
                    {indexLog.slice(0,15).map((r,i)=>(
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span>{r.status==='submitted'?'✅':'⚠️'}</span>
                        <span className="text-gray-500 truncate flex-1">{r.url.replace('https://thetechbharat.com','')}</span>
                        <span className={`font-mono text-[10px] ${r.status==='submitted'?'text-green-600':'text-red-400'}`}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── AI META GENERATOR ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-1">🏷️ Manual AI Meta Generator</h2>
                <p className="text-xs text-gray-500 mb-3">Generate for a specific article by slug. Saves automatically to Redis.</p>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="article slug (e.g. gopro-lit-hero-india-review)" value={seoMetaSlug}
                    onChange={e=>setSeoMetaSlug(e.target.value)}
                    className="flex-1 text-sm border border-gray-200 px-3 py-2 rounded-lg outline-none" />
                  <button onClick={async()=>{
                    if(!seoMetaSlug.trim()) return
                    setSeoLoading(true); setSeoMetaResult(null)
                    const r=await fetch('/api/seo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'generate_meta',slug:seoMetaSlug,title:seoMetaSlug})})
                    const d=await r.json(); setSeoMetaResult(d); setSeoLoading(false)
                    if(!d.error) setSeoMsg(`✅ Meta generated and saved for: ${seoMetaSlug}`)
                  }} disabled={seoLoading} className="bg-[#1a3a5c] text-white text-xs font-bold px-5 py-2 rounded-lg disabled:opacity-50">
                    Generate
                  </button>
                </div>
                {seoMetaResult && !seoMetaResult.error && (
                  <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">SEO Title</span>
                      <p className="text-sm text-gray-800 font-semibold mt-0.5">{seoMetaResult.seoTitle}</p>
                      <span className="text-[10px] text-gray-400">{String(seoMetaResult.seoTitle||'').length}/60 chars</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">Meta Description</span>
                      <p className="text-sm text-gray-700 mt-0.5">{seoMetaResult.metaDescription}</p>
                      <span className="text-[10px] text-gray-400">{String(seoMetaResult.metaDescription||'').length}/160 chars</span>
                    </div>
                    <div className="flex gap-4">
                      <div><span className="text-[10px] font-bold text-blue-600 uppercase">Focus Keyword</span><p className="text-xs font-mono text-gray-700 mt-0.5">{seoMetaResult.focusKeyword}</p></div>
                      {seoMetaResult.secondaryKeywords && <div><span className="text-[10px] font-bold text-blue-600 uppercase">Secondary</span><p className="text-xs text-gray-600 mt-0.5">{(seoMetaResult.secondaryKeywords as unknown as string[]).join(', ')}</p></div>}
                    </div>
                  </div>
                )}
                {seoMetaResult?.error && <p className="text-xs text-red-500 mt-2">Error: {seoMetaResult.error}</p>}
              </div>

              {/* ── MISSING META LIST ── */}
              {seoMissingMeta.length>0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-bold text-gray-800">⚠️ Articles Missing SEO Meta ({seoMissingMeta.length})</h2>
                    <button onClick={async()=>{
                      setSeoLoading(true); setSeoMsg('Generating all missing meta...')
                      const r=await fetch('/api/seo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'generate_all_meta'})})
                      const d=await r.json()
                      setSeoMsg(`✅ Generated ${d.generated} metas`); setSeoMissingMeta([]); setSeoLoading(false)
                    }} disabled={seoLoading} className="text-xs bg-[#1a3a5c] text-white font-bold px-4 py-1.5 rounded-lg disabled:opacity-50">
                      Fix All
                    </button>
                  </div>
                  <div className="space-y-2 max-h-56 overflow-y-auto">
                    {seoMissingMeta.map(art=>(
                      <div key={art.slug} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-800 truncate">{art.title}</p>
                          <p className="text-[10px] text-gray-400 font-mono">{art.slug}</p>
                        </div>
                        <button onClick={async()=>{
                          setSeoLoading(true)
                          await fetch('/api/seo',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'generate_meta',slug:art.slug,title:art.title})})
                          setSeoMissingMeta(prev=>prev.filter(a=>a.slug!==art.slug))
                          setSeoLoading(false)
                        }} disabled={seoLoading} className="ml-3 text-[10px] bg-[#d4220a] text-white font-bold px-3 py-1.5 rounded-lg disabled:opacity-40 shrink-0">
                          Generate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SETUP GUIDE ── */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <h2 className="text-sm font-bold text-amber-800 mb-3">📋 One-Time Setup: Google Service Account</h2>
                <div className="grid md:grid-cols-2 gap-4 text-xs text-amber-700">
                  <div>
                    <p className="font-bold mb-1">For GSC Traffic Data + Indexing API:</p>
                    <ol className="space-y-1 list-decimal list-inside">
                      <li>Go to <strong>console.cloud.google.com</strong></li>
                      <li>Enable <strong>Search Console API</strong> + <strong>Indexing API</strong></li>
                      <li>IAM → Service Accounts → Create → Download JSON</li>
                      <li>Add Vercel env: <code className="bg-amber-100 px-1 rounded">GOOGLE_SERVICE_KEY</code> = entire JSON minified</li>
                      <li>GSC → Settings → Users → add service account email as <strong>Owner</strong></li>
                    </ol>
                  </div>
                  <div>
                    <p className="font-bold mb-1">For UptimeRobot Free Cron:</p>
                    <ol className="space-y-1 list-decimal list-inside">
                      <li>Sign up at <strong>uptimerobot.com</strong> (free)</li>
                      <li>New Monitor → HTTP(s) → paste URL:</li>
                    </ol>
                    <code className="block mt-2 bg-amber-100 px-2 py-1.5 rounded text-[10px] break-all">
                      https://thetechbharat.com/api/seo-cron?secret=qwertyuiopasdfghjklzxcvbnm
                    </code>
                    <p className="mt-1 text-[10px]">Interval: 60 min — runs full refresh every 20h automatically</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ── ANALYTICS ── */}
          {tab==='analytics' && (
            <SeoAnalyticsTab />
          )}

          {/* ── SETTINGS ── */}
          {tab==='settings' && (
            <div className="space-y-4">
              <h1 className="text-lg font-bold text-gray-900">Settings</h1>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-800 mb-3">API Keys</h2>
                <div className="space-y-2">
                  {[{key:'newsapi',label:'NewsAPI',url:'https://newsapi.org/register',free:'100/day'},{key:'gnews',label:'GNews',url:'https://gnews.io',free:'100/day'},{key:'anthropic',label:'Anthropic',url:'https://console.anthropic.com',free:'Pay per use'},{key:'groq',label:'Groq (FREE)',url:'https://console.groq.com',free:'14,400/day'},{key:'unsplash',label:'Unsplash',url:'https://unsplash.com/developers',free:'50/hr'}].map(item=>(
                    <div key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div><p className="text-sm font-semibold text-gray-800">{item.label}</p><p className="text-[10px] text-gray-400">{item.free}</p></div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${statusColor[apiStatus[item.key]||'unknown']}`}>{apiStatus[item.key]==='ok'?'✓ Set':'✗ Missing'}</span>
                        <a href={item.url} target="_blank" className="text-[10px] text-[#d4220a] hover:underline">Get key →</a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-3">✅ AdSense Checklist</h2>
                {[{done:(stats?.total||0)>=20,text:`20+ articles (current: ${stats?.total||0})`},{done:stories.length>=5,text:`5+ web stories (current: ${stories.length})`},{done:true,text:'All required pages ✓'},{done:false,text:'Add Google Analytics'},{done:false,text:'Verify Search Console'},{done:false,text:'Custom domain connected'}].map((item,i)=>(
                  <div key={i} className="flex items-center gap-2 mb-2">
                    <span className={item.done?'text-green-500':'text-gray-300'}>{item.done?'✓':'○'}</span>
                    <span className={`text-sm ${item.done?'text-gray-700':'text-gray-400'}`}>{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                <h2 className="text-sm font-bold text-gray-700 mb-2">Sign Out</h2>
                <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-5 py-2 rounded-lg">Sign Out of Admin</button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* DELETE ARTICLE MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full">
            <h3 className="font-bold text-gray-900 mb-2">Delete Article?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={()=>setDeleteId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
              <button onClick={()=>handleDelete(deleteId)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE STORY MODAL */}
      {deleteStoryId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 w-full">
            <h3 className="font-bold text-gray-900 mb-2">Delete Story?</h3>
            <p className="text-sm text-gray-500 mb-5">This cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={()=>setDeleteStoryId(null)} className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg">Cancel</button>
              <button onClick={()=>handleDeleteStory(deleteStoryId)} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT ARTICLE MODAL */}
      {editArticle && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h3 className="font-bold text-gray-900">Edit Article</h3>
              <button onClick={()=>setEditArticle(null)} className="text-gray-400 hover:text-gray-700 text-xl">✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Title</label><input type="text" value={editArticle.title} onChange={e=>setEditArticle({...editArticle,title:e.target.value})} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Brand</label><input type="text" value={editArticle.brand} onChange={e=>setEditArticle({...editArticle,brand:e.target.value})} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none"/></div>
                <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Type</label><select value={editArticle.type} onChange={e=>setEditArticle({...editArticle,type:e.target.value})} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none bg-white"><option value="mobile-news">Mobile News</option><option value="review">Review</option><option value="compare">Compare</option></select></div>
              </div>
              <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Summary</label><textarea rows={3} value={editArticle.summary} onChange={e=>setEditArticle({...editArticle,summary:e.target.value})} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none resize-none"/></div>
              <div><label className="text-xs font-bold text-gray-500 uppercase block mb-1.5">Tags</label><input type="text" value={editArticle.tags?.join(', ')||''} onChange={e=>setEditArticle({...editArticle,tags:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)})} className="w-full text-sm border border-gray-200 px-3 py-2.5 rounded-lg outline-none"/></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="feat" checked={editArticle.isFeatured} onChange={e=>setEditArticle({...editArticle,isFeatured:e.target.checked})} className="w-4 h-4"/><label htmlFor="feat" className="text-sm text-gray-700">Featured</label></div>
              <div className="flex gap-3 pt-2"><button onClick={handleSaveEdit} className="bg-[#1a3a5c] text-white text-sm font-bold px-6 py-2.5 rounded-lg">Save</button><button onClick={()=>setEditArticle(null)} className="text-sm text-gray-500 border border-gray-200 px-5 py-2.5 rounded-lg">Cancel</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}