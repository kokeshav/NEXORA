/* ===== COPA ROUTER ENGINE : OPTIMIZED ===== */

class COPARouter{
    constructor(){
        this.views={
            login:document.getElementById('auth-wrapper'),
            dashboard:document.getElementById('dashboard-wrapper'),
            quiz:document.getElementById('quiz-wrapper'),
            scorecard:document.getElementById('scorecard-wrapper')
        };
        this.currentView=null;
        this.isNavigating=false;
        this.ANIM={ enter:600, exit:400};
        this.init();
    }

    init(){
        const visible=Object.entries(this.views).find(([,el])=>el&&getComputedStyle(el).display!=='none');
        if(!visible) return;
        this.currentView=visible[0];
        this.applyEnterAnimation(visible[1]);
    }

    async navigateTo(viewName){
        if(this.isNavigating||!this.views[viewName]||this.currentView===viewName) return;
        this.isNavigating=true;

        const oldView=this.views[this.currentView];
        const newView=this.views[viewName];

        if(oldView){
            await this.applyExitAnimation(oldView);
            oldView.style.display='none';
        }

        this.currentView=viewName;
        newView.style.display=newView.dataset.display||'block';

        await this.applyEnterAnimation(newView);

        document.dispatchEvent(new CustomEvent('copaRouteChanged',{detail:{view:viewName}}));
        this.isNavigating=false;
    }

    applyEnterAnimation(el){
        return new Promise(resolve=>{
            Object.assign(el.style,{
                opacity:'0',
                transform:'translateY(30px) scale(.98)',
                transition:'opacity .5s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.34,1.56,.64,1)'
            });

            requestAnimationFrame(()=>{
                Object.assign(el.style,{
                    opacity:'1',
                    transform:'translateY(0) scale(1)'
                });

                el.addEventListener('transitionend',()=>{
                    el.style.transition='';
                    resolve();
                },{once:true});
            });
        });
    }

    applyExitAnimation(el){
        return new Promise(resolve=>{
            Object.assign(el.style,{
                opacity:'1',
                transform:'translateY(0) scale(1)',
                transition:'opacity .3s ease,transform .4s ease'
            });

            requestAnimationFrame(()=>{
                Object.assign(el.style,{
                    opacity:'0',
                    transform:'translateY(-20px) scale(.98)'
                });

                el.addEventListener('transitionend',()=>{
                    Object.assign(el.style,{
                        opacity:'',
                        transform:'',
                        transition:''
                    });
                    resolve();
                },{once:true});
            });
        });
    }
}

    /* ===== MATERIAL EFFECTS : OPTIMIZED ===== */

class MaterialEffects{
    static initialized=false;

    static init(){
        if(this.initialized) return;
        this.initialized=true;
        this.injectRippleCSS();
        document.addEventListener('mousedown',e=>this.createRipple(e));
        document.addEventListener('touchstart',e=>this.createRipple(e),{passive:true});
    }

    static createRipple(event){
        const target=event.target.closest('.btn-main,.btn-outline,.option-btn,.chapter-card,.palette-btn');
        if(!target) return;

        const rect=target.getBoundingClientRect(),
              diameter=Math.max(rect.width,rect.height),
              radius=diameter/2,
              clientX=event.clientX??event.touches?.[0]?.clientX,
              clientY=event.clientY??event.touches?.[0]?.clientY;

        if(clientX==null||clientY==null) return;

        target.querySelectorAll('.material-ripple').forEach(r=>r.remove());

        const circle=document.createElement('span');
        circle.className='material-ripple';

        Object.assign(circle.style,{
            width:`${diameter}px`,
            height:`${diameter}px`,
            left:`${clientX-rect.left-radius}px`,
            top:`${clientY-rect.top-radius}px`
        });

        target.appendChild(circle);
        setTimeout(()=>circle.isConnected&&circle.remove(),600);
    }

    static injectRippleCSS(){
        if(document.getElementById('ripple-css')) return;

        const style=document.createElement('style');
        style.id='ripple-css';
        style.textContent=`
            .btn-main,.btn-outline,.option-btn,.chapter-card,.palette-btn{position:relative;overflow:hidden}
            .material-ripple{
                position:absolute;border-radius:50%;transform:scale(0);
                animation:materialRippleAnim .6s linear;
                background:rgba(255,255,255,.3);
                pointer-events:none;z-index:10;
            }
            @keyframes materialRippleAnim{to{transform:scale(4);opacity:0}}
        `;

        document.head.appendChild(style);
    }
} 

/* ===== VISUAL HUD : OPTIMIZED ===== */

class VisualHUD{
    static renderDashboardRings(){
        const cards=document.querySelectorAll('.chapter-card'),
              userHistory=typeof AppDB!=='undefined'
                ? AppDB.getHistoryByUser(window.activeUser)
                : {};

        cards.forEach((card,index)=>{
            if(card.querySelector('.ch-progress-canvas')) return;

            const chapterId=card.dataset.chapterId||index+1;

            const attempts=userHistory?.[chapterId]||[],
                  bestScore=attempts.length
                    ? Math.max(...attempts.map(a=>parseFloat(a.score)||0))
                    : 0;

            const ring=document.createElement('div'),
                  canvas=document.createElement('canvas');

            ring.className='progress-ring-container';
            ring.style.cssText='position:absolute;top:20px;right:20px;width:50px;height:50px';

            canvas.width=100;
            canvas.height=100;
            canvas.className='ch-progress-canvas';
            canvas.style.cssText='width:100%;height:100%';

            ring.appendChild(canvas);
            card.appendChild(ring);

            this.animateCircularProgress(canvas,bestScore);
        });
    }


    /* ===== VISUAL HUD : OPTIMIZED ===== */

static animateCircularProgress(canvas,targetPercentage){

    if(!canvas?.isConnected) return;

    const ctx=canvas.getContext('2d'),
          cx=canvas.width/2,
          cy=canvas.height/2,
          radius=cx-8,
          percent=Math.max(0,Math.min(100,Number(targetPercentage)||0)),
          color=percent>=80?'#00d97e':percent>=50?'#3d8ef0':'#ff4d6d';

    let current=0;

    ctx.lineWidth=12;
    ctx.lineCap='round';
    ctx.textAlign='center';
    ctx.textBaseline='middle';
    ctx.font='bold 24px Syne,sans-serif';

    const draw=()=>{

        if(!canvas.isConnected) return;

        ctx.clearRect(0,0,canvas.width,canvas.height);

        ctx.beginPath();
        ctx.arc(cx,cy,radius,0,Math.PI*2);
        ctx.strokeStyle='rgba(255,255,255,.05)';
        ctx.stroke();

        if(current>0){
            ctx.beginPath();
            ctx.arc(cx,cy,radius,-Math.PI/2,-Math.PI/2+(current/100)*Math.PI*2);
            ctx.strokeStyle=color;
            ctx.stroke();
        }

        ctx.fillStyle='#fff';
        ctx.fillText(percent?`${Math.floor(current)}%`:'New',cx,cy);

        if(current<percent){
            current+=(percent-current)*.1+1;
            if(current>percent) current=percent;
            requestAnimationFrame(draw);
        }
    };

    requestAnimationFrame(draw);
}

/* ===== STICKY QUIZ BAR ===== */

static injectStickyQuizProgressBar(){

    if(document.getElementById('elite-progress-bar')) return;

    const bar=document.createElement('div'),
          fill=document.createElement('div');

    bar.id='elite-progress-bar';
    fill.id='elite-progress-fill';

    bar.style.cssText='position:fixed;top:0;left:0;height:5px;width:100%;background:var(--color-surface-2,#132547);z-index:999999;display:none';

    fill.style.cssText='height:100%;width:0%;background:linear-gradient(90deg,#3d8ef0,#8b5cf6,#00d97e);background-size:200% 100%;animation:gradientMove 2s linear infinite;transition:width .4s cubic-bezier(.34,1.56,.64,1)';

    if(!document.getElementById('elite-progress-style')){
        const style=document.createElement('style');
        style.id='elite-progress-style';
        style.textContent='@keyframes gradientMove{0%{background-position:100% 0}100%{background-position:-100% 0}}';
        document.head.appendChild(style);
    }

    bar.appendChild(fill);
    document.body.appendChild(bar);
}

static updateQuizProgress(currentIndex,totalQuestions){

    const bar=document.getElementById('elite-progress-bar'),
          fill=document.getElementById('elite-progress-fill');

    if(!bar||!fill||!totalQuestions) return;

    bar.style.display='block';

    const percentage=Math.max(
        0,
        Math.min(100,((currentIndex+1)/totalQuestions)*100)
    );

    fill.style.width=`${percentage}%`;        requestAnimationFrame(()=>this.animate(ctx,particles,w,h));
    }
    
    /* ===== DASHBOARD ENHANCER : OPTIMIZED ===== */
} //visualhud end
/* ===== SCROLL ORCHESTRATOR : OPTIMIZED ===== */
class ScrollOrchestrator{
static init(){

    if(this.initialized) return;
    this.initialized=true;

    const options={root:null,rootMargin:'0px',threshold:.15};

    this.observer=new IntersectionObserver((entries,observer)=>{
        entries.forEach(entry=>{
            if(!entry.isIntersecting) return;
            entry.target.classList.add('reveal-active');
            observer.unobserve(entry.target);
        });
    },options);

    this.injectRevealCSS();
    this.observeElements();
}

static observeElements(){

    if(!this.observer) return;

    document
        .querySelectorAll('.chapter-card,.question-container,.stat-box')
        .forEach((el,index)=>{

            if(el.dataset.revealInit) return;

            el.dataset.revealInit='1';
            el.classList.add('reveal-item');
            el.style.transitionDelay=`${(index%10)*50}ms`;

            this.observer.observe(el);
        });
}

static injectRevealCSS(){

    if(document.getElementById('reveal-css')) return;

    const style=document.createElement('style');

    style.id='reveal-css';

    style.textContent=`
        .reveal-item{
            opacity:0;
            transform:translateY(40px);
            transition:
                opacity .6s cubic-bezier(.2,.8,.2,1),
                transform .6s cubic-bezier(.34,1.56,.64,1);
        }
        .reveal-active{
            opacity:1;
            transform:translateY(0);
        }
    `;

    document.head.appendChild(style);
}
}
/* ===== GLOBAL BOOTSTRAPPER ===== */

document.addEventListener('DOMContentLoaded',()=>{

    if(window.__COPA_UI_READY__) return;
    window.__COPA_UI_READY__=true;

    console.log('🎨 BOOTSTRAPPING GOOGLE-GRADE UI ENGINE...');

    window.AppRouter ??= new COPARouter();

    MaterialEffects.init();
    VisualHUD.injectStickyQuizProgressBar();
    ScrollOrchestrator.init();

    document.addEventListener('copaRouteChanged',e=>{

        const view=e.detail?.view,
              pBar=document.getElementById('elite-progress-bar');

        if(pBar) pBar.style.display=view==='quiz'?'block':'none';

        if(view==='dashboard'){
            setTimeout(()=>{
                VisualHUD.renderDashboardRings();
                ScrollOrchestrator.observeElements();
            },300);
        }
    });

    setTimeout(()=>{
        VisualHUD.renderDashboardRings();
        ScrollOrchestrator.observeElements();
    },1000);

});

/* ===== SMART EVENT INTERCEPTOR ===== */

document.addEventListener('click',e=>{

    const trigger=e.target.closest('#btn-next,#btn-prev,.palette-btn');
    if(!trigger) return;

    setTimeout(()=>{

        if(
            typeof currentQIndex!=='undefined' &&
            Array.isArray(currentQuestionsArray)
        ){
            VisualHUD.updateQuizProgress(
                currentQIndex,
                currentQuestionsArray.length||1
            );
        }

    },50);

});
/* ===== COPA OFFLINE ENGINE : OPTIMIZED ===== */

class COPAOfflineEngine{

    static initPWA(){

        if(!('serviceWorker' in navigator)) return;

        console.log('🌐 Initializing Enterprise PWA Offline Engine...');

        navigator.serviceWorker
            .register('./sw.js')
            .then(()=>{
                console.log('✅ PWA Engine Registered.');
            })
            .catch(err=>console.error('❌ PWA Registration failed:',err));
    }

}

/* ===== COSMIC PARTICLE ENGINE : OPTIMIZED ===== */

class CosmicParticleEngine{

    static init(){

        const auth=document.getElementById('auth-wrapper');
        if(!auth||document.getElementById('cosmic-canvas')) return;

        auth.style.backgroundColor='transparent';

        const canvas=document.createElement('canvas');

        canvas.id='cosmic-canvas';

        canvas.style.cssText=
            'position:fixed;inset:0;width:100%;height:100%;z-index:0;background:var(--color-background,#040d1a);pointer-events:none';

        document.body.prepend(canvas);

        const ctx=canvas.getContext('2d');

        let particles=[],
            w=canvas.width=innerWidth,
            h=canvas.height=innerHeight;

        const resize=()=>{

            w=canvas.width=innerWidth;
            h=canvas.height=innerHeight;

            this.createParticles(particles,w,h);

        };

        window.addEventListener('resize',resize,{passive:true});

        this.createParticles(particles,w,h);
        this.animate(ctx,particles,w,h);
    }

    static createParticles(arr,w,h){

        arr.length=0;

        const count=Math.min(
            140,
            Math.max(
                25,
                Math.floor((w*h)/20000)
            )
        );

        for(let i=0;i<count;i++){

            arr.push({
                x:Math.random()*w,
                y:Math.random()*h,
                size:Math.random()*2+1,
                speedX:Math.random()-0.5,
                speedY:Math.random()-0.5
            });

        }
    }


/* ===== COSMIC PARTICLE ENGINE : OPTIMIZED ===== */

static animate(ctx,particles,w,h){

    if(!ctx?.canvas?.isConnected) return;

    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='rgba(61,142,240,.8)';

    const maxDist=120,
          maxDistSq=maxDist*maxDist;

    for(let i=0;i<particles.length;i++){

        const p=particles[i];

        p.x+=p.speedX;
        p.y+=p.speedY;

        if(p.x<0||p.x>w) p.speedX*=-1;
        if(p.y<0||p.y>h) p.speedY*=-1;

        ctx.beginPath();
        ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
        ctx.fill();

        for(let j=i+1;j<particles.length;j++){

            const p2=particles[j],
                  dx=p.x-p2.x,
                  dy=p.y-p2.y,
                  distSq=dx*dx+dy*dy;

            if(distSq>maxDistSq) continue;

            const opacity=1-(distSq/maxDistSq);

            ctx.beginPath();
            ctx.strokeStyle=`rgba(61,142,240,${opacity})`;
            ctx.lineWidth=.5;
            ctx.moveTo(p.x,p.y);
            ctx.lineTo(p2.x,p2.y);
            ctx.stroke();
        }
    
 } // <-- OUTER FOR LOOP CLOSE

    requestAnimationFrame(()=>this.animate(ctx,particles,w,h));
}// animate() close

} // CosmicParticleEngine class close


/* ===== DASHBOARD ENHANCER : OPTIMIZED ===== */
class DashboardEnhancer{

    static injectSearchBar(){

        const dashboard=document.getElementById('dashboard-wrapper'),
              grid=document.querySelector('.chapter-grid')||document.getElementById('chapter-grid');

        if(!dashboard||!grid||document.getElementById('copa-search-bar')) return;

        const wrap=document.createElement('div');

        wrap.id='copa-search-bar';

        wrap.style.cssText='max-width:600px;margin:0 auto 30px;position:relative';

        wrap.innerHTML=`
            <input
                type="text"
                id="chapter-search-input"
                placeholder="🔍 Search chapters (e.g., HTML, Java, Cyber...)"
                style="width:100%;padding:18px 25px 18px 50px;border-radius:50px;border:1px solid var(--color-border,#1f3a72);background:rgba(13,30,58,.6);backdrop-filter:blur(10px);color:#fff;font-size:1.1rem;font-family:var(--font-body);outline:none;box-shadow:0 10px 30px rgba(0,0,0,.3);transition:.3s ease"
            >
            <span style="position:absolute;left:20px;top:50%;transform:translateY(-50%);font-size:1.2rem">🔎</span>
        `;

        dashboard.insertBefore(wrap,grid);

        const input=wrap.querySelector('#chapter-search-input');

        input.addEventListener('focus',()=>input.style.borderColor='#3d8ef0');
        input.addEventListener('blur',()=>input.style.borderColor='var(--color-border,#1f3a72)');

        let debounce;

        input.addEventListener('input',e=>{

            clearTimeout(debounce);

            debounce=setTimeout(()=>{

                const query=e.target.value.trim().toLowerCase(),
                      cards=grid.querySelectorAll('.chapter-card');

                let found=0;

                cards.forEach(card=>{

                    const title=
                        (
                            card.querySelector('h2,h3,h4')?.textContent ||
                            card.textContent
                        ).toLowerCase();

                    const match=title.includes(query);

                    card.style.display=match?'':'none';

                    if(match){
                        found++;
                        if(!card.dataset.animDone){
                            card.dataset.animDone='1';
                            card.style.animation='fadeSlideUp .35s ease forwards';
                        }
                    }
                });

                let noResultMsg=document.getElementById('no-search-result');

                if(found===0){

                    if(!noResultMsg){

                        noResultMsg=document.createElement('div');

                        noResultMsg.id='no-search-result';

                        noResultMsg.style.cssText=
                            'text-align:center;padding:40px;color:#94a3b8;font-size:1.2rem;width:100%;grid-column:1/-1';

                        noResultMsg.textContent='🚫 No chapters found matching your search.';

                        grid.appendChild(noResultMsg);
                    }

                    noResultMsg.style.display='block';

                }else if(noResultMsg){

                    noResultMsg.style.display='none';

                }

            },120);

        });

    }

}

/* ===== REPORT GENERATOR : OPTIMIZED ===== */

class ReportGenerator{

    static initialized=false;

    static init(){

        if(this.initialized) return;
        this.initialized=true;

        document.addEventListener('click',e=>{

            const trigger=e.target.closest('button,[role="button"],a');

            if(
                !trigger ||
                !/analytics/i.test(trigger.textContent||'')
            ) return;

            setTimeout(()=>{

                const modal=document.getElementById('history-modal'),
                      header=modal?.querySelector('div');

                if(!header||document.getElementById('btn-export-csv')) return;

                const btn=document.createElement('button');

                btn.id='btn-export-csv';
                btn.textContent='📥 Export to Excel (CSV)';
                btn.style.cssText='padding:8px 16px;background:#00d97e;color:#040d1a;border:none;border-radius:8px;font-weight:700;cursor:pointer;margin-right:15px;box-shadow:0 4px 15px rgba(0,217,126,.3)';

                btn.addEventListener('click',()=>this.generateCSV());

                header.insertBefore(btn,header.lastElementChild);

            },200);

        });

    }

    static safeCSV(v){

        const value=String(v??'');

        return /^[=+\-@]/.test(value)
            ? `'${value.replace(/"/g,'""')}`
            : value.replace(/"/g,'""');
    }

    static generateCSV(){

        const user=
            window.activeUser ||
            localStorage.getItem('currentUser') ||
            'Student';

        const history=
            typeof AppDB!=='undefined'
                ? AppDB.getHistoryByUser(user)
                : {};

        const rows=[
            ['Date','Chapter ID','Score (%)','Correct','Wrong','Skipped']
        ];

        let hasData=false;

        Object.entries(history).forEach(([chapterId,attempts])=>{

            attempts.forEach(a=>{

                hasData=true;

                rows.push([
                    new Date(a.timestamp).toLocaleDateString(),
                    `Chapter ${chapterId}`,
                    a.score,
                    a.correct||0,
                    a.wrong||0,
                    a.skipped||0
                ]);

            });

        });

        if(!hasData){
            alert('No test data available to export!');
            return;
        }

        const csv=
            rows
                .map(r=>r.map(this.safeCSV).map(v=>`"${v}"`).join(','))
                .join('\n');

        const blob=new Blob(
            [csv],
            {type:'text/csv;charset=utf-8'}
        );

        const url=URL.createObjectURL(blob);

        const safeUser=user.replace(/[^\w.-]/g,'_');

        const link=document.createElement('a');

        link.href=url;

        link.download=
            `COPA_Report_${safeUser}_${new Date().toISOString().split('T')[0]}.csv`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        URL.revokeObjectURL(url);

        if(typeof showToast==='function'){
            showToast('Report Downloaded Successfully! 📊','success');
        }
    }

}

/* ===== STEP-59 BOOTSTRAP ===== */

document.addEventListener('DOMContentLoaded',()=>{

    if(window.__COPA_STEP59__) return;
    window.__COPA_STEP59__=true;

    console.log('🚀 INJECTING STEP 59 ADVANCED MODULES...');

    COPAOfflineEngine.initPWA();

    const auth=document.getElementById('auth-wrapper');

    if(auth&&getComputedStyle(auth).display!=='none'){
        CosmicParticleEngine.init();
    }

    document.addEventListener('copaRouteChanged',e=>{

        const canvas=document.getElementById('cosmic-canvas');

        if(
            e.detail?.view==='login'||
            e.detail?.view==='auth-wrapper'
        ){

            if(canvas) canvas.style.display='block';
            else CosmicParticleEngine.init();

        }else if(canvas){

            canvas.style.display='none';

        }

    });

    setTimeout(
        ()=>DashboardEnhancer.injectSearchBar(),
        1500
    );

    ReportGenerator.init();

});
/* ===== COPA ANTI-CHEAT : HARDENED ===== */

class COPAAntiCheat{

    static init(){

        this.warningCount=0;
        this.maxWarnings=3;
        this.cooldown=false;

        window.addEventListener('blur',()=>{

            const quiz=document.getElementById('quiz-wrapper');

            if(
                !quiz ||
                getComputedStyle(quiz).display==='none' ||
                window.isPracticeMode
            ) return;

            setTimeout(()=>{

                if(
                    !document.hasFocus() &&
                    !this.cooldown
                ){
                    this.handleViolation();
                }

            },500);

        });

    }

    static handleViolation(){

        if(this.cooldown) return;

        this.cooldown=true;

        setTimeout(()=>{
            this.cooldown=false;
        },1200);

        this.warningCount++;

        document
            .querySelector('#copa-freeze-screen')
            ?.remove();

        const overlay=document.createElement('div');

        overlay.id='copa-freeze-screen';

        overlay.style.cssText=
            'position:fixed;inset:0;background:rgba(220,38,38,.95);backdrop-filter:blur(10px);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;padding:40px;font-family:var(--font-heading)';

        if(this.warningCount>=this.maxWarnings){

            overlay.innerHTML=`
                <span style="font-size:80px;margin-bottom:20px;">🚨</span>
                <h1 style="font-size:3rem;margin-bottom:10px;">EXAM TERMINATED</h1>
                <p style="font-size:1.4rem;">Maximum violations reached. Auto-submitting test.</p>
            `;

            document.body.appendChild(overlay);

            setTimeout(()=>{

                overlay.remove();

                if(typeof window.submitFinalTest==='function'){
                    window.submitFinalTest();
                }

            },3000);

            return;
        }

        overlay.innerHTML=`
            <span style="font-size:80px;margin-bottom:20px;">⚠️</span>
            <h1 style="font-size:3rem;margin-bottom:10px;">WARNING : TAB SWITCH DETECTED</h1>
            <p style="font-size:1.4rem;margin-bottom:25px;">Exam screen switching detected.</p>
            <button id="resume-exam-btn" style="padding:15px 40px;font-size:1.1rem;font-weight:700;background:#fff;color:#dc2626;border:none;border-radius:8px;cursor:pointer;">
                Return To Exam
            </button>
        `;

        document.body.appendChild(overlay);

        overlay
            .querySelector('#resume-exam-btn')
            ?.addEventListener('click',()=>{

                overlay.remove();

                if(typeof showToast==='function'){
                    showToast(
                        'Activity logged. Continue exam.',
                        'error'
                    );
                }

            },{once:true});

    }

}

/* ===== GRAND MOCK TEST ENGINE : OPTIMIZED ===== */

class COPAMockTestEngine{

    static CONFIG={
        MOCK_ID:'99',
        LIMIT:50,
        OPEN_DELAY:800
    };

    static injectMockTestCard(){

        setTimeout(()=>{

            const dashboard=
                document.getElementById('chapter-grid') ||
                document.querySelector('.chapter-grid');

            if(
                !dashboard ||
                dashboard.querySelector('#grand-mock-card')
            ) return;

            const card=document.createElement('div');

            card.id='grand-mock-card';
            card.className='chapter-card';

            card.style.cssText=
                'background:linear-gradient(145deg,#2e1065 0%,#4c1d95 100%);border:2px solid #f59e0b;box-shadow:0 10px 40px rgba(245,158,11,.3);transform:scale(1.02);grid-column:1/-1;display:flex;align-items:center;justify-content:space-between';

            card.innerHTML=`
                <div>
                    <h2 style="color:#f59e0b;font-size:1.8rem;margin-bottom:10px;display:flex;align-items:center;gap:10px">
                        <span style="font-size:2.5rem;">👑</span>
                        THE GRAND NCVT MOCK TEST
                    </h2>
                    <p style="color:#ddd;font-size:1.1rem;max-width:600px">
                        50 randomized questions from all chapters.
                    </p>
                </div>
                <button id="btn-start-mock" style="padding:15px 30px;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);color:#000;font-weight:900;font-size:1.2rem;border:none;border-radius:10px;cursor:pointer">
                    START FINAL EXAM 🚀
                </button>
            `;

            dashboard.prepend(card);

            card
                .querySelector('#btn-start-mock')
                ?.addEventListener(
                    'click',
                    ()=>this.generateAndStartMockTest(),
                    {once:false}
                );

        },2000);

    }

    static generateAndStartMockTest(){

        const db=window.masterQuizDatabase;

        if(!db){
            console.error('Database not found.');
            return;
        }

        const pool=[];

        Object.entries(db).forEach(
            ([chapterId,questions])=>{

                if(!Array.isArray(questions)) return;

                questions.forEach(q=>{

                    pool.push({
                        ...q,
                        originalChapter:chapterId
                    });

                });

            }
        );
        if(pool.length===0){
            console.error('Empty question pool.');
            return;
        }

        const shuffled=
            [...pool].sort(()=>Math.random()-0.5);

        const selected=
            shuffled.slice(0,this.CONFIG.LIMIT);

        window.masterQuizDatabase[
            this.CONFIG.MOCK_ID
        ]=selected;

        setTimeout(()=>{

            if(
                window.QuizEngine &&
                typeof QuizEngine.startModule==='function'
            ){
                QuizEngine.startModule(
                    this.CONFIG.MOCK_ID
                );
            }

        },this.CONFIG.OPEN_DELAY);

    }

}
class COPASpeechEngine{

    static observer=null;
    static utterance=null;

    static init(){

        if(
            !('speechSynthesis' in window) ||
            !('SpeechSynthesisUtterance' in window)
        ){
            console.warn(
                'Speech API unsupported.'
            );
            return;
        }

        document.addEventListener(
            'DOMContentLoaded',
            ()=>this.watchQuiz()
        );

        document.addEventListener(
            'copaRouteChanged',
            ()=>window.speechSynthesis.cancel()
        );

    }

    static watchQuiz(){

        const target=
            document.getElementById('quiz-wrapper');

        if(!target) return;

        this.observer?.disconnect();

        this.observer=
            new MutationObserver(()=>{

                this.injectAudioButton();

            });

        this.observer.observe(
            target,
            {
                childList:true,
                subtree:true
            }
        );

    }

    static injectAudioButton(){

        const question=
            document.getElementById('question-text') ||
            document.querySelector('.question-text');

        if(
            !question ||
            question.querySelector('#ai-voice-btn')
        ) return;

        const btn=document.createElement('button');

        btn.id='ai-voice-btn';

        btn.type='button';

        btn.title='Read Question Aloud';

        btn.setAttribute(
            'aria-label',
            'Read Question Aloud'
        );

        btn.textContent='🔊';

        btn.style.cssText=
            'background:transparent;border:none;font-size:1.5rem;cursor:pointer;margin-left:12px;vertical-align:middle;transition:transform .2s ease';

        btn.addEventListener(
            'mouseenter',
            ()=>btn.style.transform='scale(1.15)'
        );

        btn.addEventListener(
            'mouseleave',
            ()=>btn.style.transform='scale(1)'
        );

        btn.addEventListener(
            'click',
            ()=>this.readQuestion(btn)
        );

        question.insertAdjacentElement(
            'beforeend',
            btn
        );

    }

    static readQuestion(btn){

        const synth=
            window.speechSynthesis;

        synth.cancel();

        const question=
            document.getElementById('question-text') ||
            document.querySelector('.question-text');

        if(!question) return;

        let text=
            question.innerText.trim();

        const options=
            [
                ...document.querySelectorAll(
                    '.option-btn'
                )
            ];

        if(options.length){

            text+=' The options are. ';

            options.forEach((opt,i)=>{

                const letter=
                    String.fromCharCode(65+i);

                text+=
                    `Option ${letter}. ${opt.innerText}. `;

            });

        }

        const utterance=
            new SpeechSynthesisUtterance(text);

        const loadVoice=()=>{

            const voices=
                synth.getVoices();

            const preferred=
                voices.find(
                    v=>
                    /hi-IN|en-IN/i.test(v.lang)
                ) ||
                voices.find(
                    v=>/en/i.test(v.lang)
                );

            if(preferred){

                utterance.voice=
                    preferred;

            }

        };

        loadVoice();

        synth.onvoiceschanged=loadVoice;

        utterance.rate=.9;

        utterance.pitch=1;

        utterance.volume=1;

        btn.textContent='🗣️';

        utterance.onend=()=>{

            btn.textContent='🔊';

        };

        utterance.onerror=()=>{

            btn.textContent='🔊';

        };

        this.utterance=utterance;

        synth.speak(utterance);

    }

}

 class COPACertificateEngine{

    static CONFIG={
        MOCK_ID:'99',
        PASS_MARK:60
    };

    static init(){

        document.addEventListener(
            'click',
            e=>{

                if(
                    e.target?.id!=='submit-final-test'
                ) return;

                requestAnimationFrame(
                    ()=>this.checkForGraduation()
                );

            }
        );

    }

    static checkForGraduation(){

        if(
            String(window.activeChapterId)!==
            this.CONFIG.MOCK_ID
        ) return;

        const scoreNode=
            document.getElementById(
                'final-percentage'
            );

        if(!scoreNode) return;

        const score=
            Number.parseFloat(
                scoreNode.textContent
                    ?.replace(/[^\d.]/g,'')
            ) || 0;

        if(
            score>=this.CONFIG.PASS_MARK
        ){

            this.injectCertificateButton();

            return;
        }

        if(
            typeof showToast==='function'
        ){

            showToast(
                `You need ${this.CONFIG.PASS_MARK}% to unlock the certificate.`,
                'warning',
                5000
            );

        }

    }

    static injectCertificateButton(){

        const header=
            document
                .querySelector(
                    '#scorecard-wrapper .scorecard-header'
                );

        if(
            !header ||
            header.querySelector(
                '#btn-download-cert'
            )
        ) return;

        const btn=
            document.createElement('button');

        btn.id='btn-download-cert';

        btn.type='button';

        btn.setAttribute(
            'aria-label',
            'Download Certificate'
        );

        btn.textContent=
            '🎓 Download Certificate';

        btn.className=
            'copa-cert-btn';

        btn.style.cssText=
            'display:block;margin:25px auto 0;padding:16px 35px;background:linear-gradient(135deg,#fbbf24,#d97706);color:#000;font-size:1.2rem;font-weight:800;border:none;border-radius:12px;cursor:pointer';

        btn.addEventListener(
            'click',
            async()=>{

                btn.disabled=true;

                btn.textContent=
                    '⏳ Generating...';

                try{

                    await this.generateCanvasCertificate();

                }
                finally{

                    btn.disabled=false;

                    btn.textContent=
                        '🎓 Download Certificate';

                }

            }
        );

        header.appendChild(btn);

    }

    static async generateCanvasCertificate(){

        const canvas=
            document.createElement(
                'canvas'
            );

        canvas.width=1800;
        canvas.height=1272;

        const ctx=
            canvas.getContext('2d');

        if(!ctx){

            console.error(
                'Canvas unavailable.'
            );

            return;
        }

        const rawUser=
            (
                window.activeUser ||
                localStorage.getItem(
                    'currentUser'
                ) ||
                'Outstanding Student'
            );

        const user=
            rawUser
                .toUpperCase()
                .slice(0,40);

        const score=
            document
                .getElementById(
                    'final-percentage'
                )
                ?.textContent || '100%';

        const issueDate=
            new Date()
                .toLocaleDateString(
                    'en-GB'
                );

        ctx.fillStyle='#040d1a';
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );

        ctx.strokeStyle='#f59e0b';
        ctx.lineWidth=16;

        ctx.strokeRect(
            45,
            45,
            canvas.width-90,
            canvas.height-90
        );

        ctx.textAlign='center';

        ctx.fillStyle='#f59e0b';

        ctx.font=
            'bold 72px Arial';

        ctx.fillText(
            'CERTIFICATE OF EXCELLENCE',
            canvas.width/2,
            220
        );

        ctx.fillStyle='#fff';

        ctx.font=
            'italic 42px serif';

        ctx.fillText(
            'Presented To',
            canvas.width/2,
            420
        );

        ctx.fillStyle='#00d97e';

        ctx.font=
            'bold 82px Arial';

        ctx.fillText(
            user,
            canvas.width/2,
            560
        );

        ctx.fillStyle='#cbd5e1';

        ctx.font=
            '38px Arial';

        ctx.fillText(
            `Grand Mock Test Score : ${score}`,
            canvas.width/2,
            760
        );

        ctx.fillText(
            `Issue Date : ${issueDate}`,
            canvas.width/2,
            880
        );

        const blob=
            await new Promise(
                resolve=>
                    canvas.toBlob(
                        resolve,
                        'image/png',
                        .95
                    )
            );

        if(!blob) return;

        const url=
            URL.createObjectURL(blob);

        const a=
            document.createElement('a');

        a.download=
            `COPA_Certificate_${user}.png`;

        a.href=url;

        a.click();

        URL.revokeObjectURL(url);

    }

}
    /* ===== QUIZ EXIT & SAFE NAVIGATION ENGINE ===== */

class COPAQuizNavigation{

    static init(){

        document.addEventListener(
            'copaRouteChanged',
            e=>{

                if(e.detail.view==='quiz'){
                    this.injectExitButton();
                }

            }
        );

    }

    static injectExitButton(){

        if(
            document.getElementById(
                'btn-exit-quiz'
            )
        ) return;

        const quiz=
            document.getElementById(
                'quiz-wrapper'
            );

        if(!quiz) return;

        const btn=
            document.createElement('button');

        btn.id='btn-exit-quiz';

        btn.type='button';

        btn.textContent='← Exit Quiz';

        btn.style.cssText=
            'position:fixed;top:16px;left:16px;z-index:9999;padding:12px 18px;background:#dc2626;color:#fff;border:none;border-radius:10px;cursor:pointer;font-weight:700;box-shadow:0 8px 20px rgba(0,0,0,.3)';

        btn.addEventListener(
            'click',
            ()=>{

                const ok=
                    confirm(
                        'Exit quiz? Unsaved progress may be lost.'
                    );

                if(!ok) return;

                if(
                    window.speechSynthesis
                ){
                    window
                        .speechSynthesis
                        .cancel();
                }

                if(
                    window.AppRouter
                ){

                    window.AppRouter
                        .navigateTo(
                            'dashboard'
                        );

                }else{

                    location.reload();

                }

            }
        );

        document.body.appendChild(btn);

    }

}

document.addEventListener(
    'DOMContentLoaded',
    ()=>{

        COPAQuizNavigation.init();

    }
);
/* ===== COPA FINAL EMERGENCY STABILITY PATCH ===== */

(()=>{

const STATE={
antiCheatCooldown:false,
activeOverlay:null
};

function safe(fn){
try{
return fn();
}catch(err){
console.error('COPA_SAFE_ERROR',err);
}
}

/* QUIZ EXIT BUTTON */

function injectExitButton(){

if(document.getElementById('btn-exit-quiz')) return;

const quiz=document.getElementById('quiz-wrapper');

if(!quiz) return;

const btn=document.createElement('button');

btn.id='btn-exit-quiz';

btn.textContent='← Exit Quiz';

btn.style.cssText='position:fixed;top:14px;left:14px;z-index:999999;padding:12px 18px;border:none;border-radius:10px;background:#dc2626;color:#fff;font-weight:800;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)';

btn.onclick=()=>{

const ok=confirm(
'Exit quiz?\nUnsaved progress may be lost.'
);

if(!ok) return;

safe(()=>window.speechSynthesis?.cancel());

if(window.AppRouter){

window.AppRouter.navigateTo(
'dashboard'
);

}else{

location.reload();

}

};

document.body.appendChild(btn);

}

/* QUIZ ROUTE WATCHER */

document.addEventListener(
'copaRouteChanged',
e=>{

if(e.detail.view==='quiz'){

injectExitButton();

}else{

document
.getElementById(
'btn-exit-quiz'
)
?.remove();

}

}
);

/* REFRESH / TAB CLOSE WARNING */

window.addEventListener(
'beforeunload',
e=>{

const quiz=
document.getElementById(
'quiz-wrapper'
);

if(
quiz &&
quiz.style.display!=='none'
){

e.preventDefault();

e.returnValue=
'Quiz progress may be lost.';

}

}
);

/* ANTICHEAT DOUBLE WARNING FIX */

if(
window.COPAAntiCheat
){

const oldHandle=
COPAAntiCheat.handleViolation;

COPAAntiCheat.handleViolation=
function(){

if(
STATE.antiCheatCooldown
) return;

STATE.antiCheatCooldown=true;

setTimeout(
()=>{

STATE.antiCheatCooldown=false;

},
2500
);

document
.querySelectorAll(
'.copa-warning-overlay'
)
.forEach(
el=>el.remove()
);

return oldHandle.call(this);

};

}

/* SPEECH CLEANUP */

window.addEventListener(
'pagehide',
()=>{

safe(
()=>window
.speechSynthesis
?.cancel()
);

}
);

/* PARTICLE CPU SAVE */

document.addEventListener(
'visibilitychange',
()=>{

const canvas=
document.getElementById(
'cosmic-canvas'
);

if(!canvas) return;

canvas.style.display=
document.hidden
?'none'
:'block';

}
);

/* ROUTER SAFETY */

if(
window.COPARouter
){

const oldNav=
COPARouter
.prototype
.navigateTo;

COPARouter
.prototype
.navigateTo=
async function(view){

if(
!this.views ||
!this.views[view]
){

console.warn(
'Invalid Route',
view
);

return;

}

return oldNav.call(
this,
view
);

};

}

/* OFFLINE CACHE VERSION BUMP */

if(
window.COPAOfflineEngine
){

COPAOfflineEngine.CACHE_VERSION=
'v2.1';

}

console.log('✅ COPA FINAL PATCH ACTIVE');

})();