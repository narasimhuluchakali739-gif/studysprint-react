import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlarmClock, ArrowRight, BookOpen, BrainCircuit, Check,
  CheckCircle2, ChevronDown, Circle, Clock3, Flame, Plus, Sparkles,
  Target, Trash2, TrendingUp, X
} from "lucide-react";

const initialTasks = [
  { id: 1, title: "Revise React fundamentals", subject: "Web Development", minutes: 45, priority: "High", done: false },
  { id: 2, title: "Practice SQL joins", subject: "Database", minutes: 30, priority: "Medium", done: false },
  { id: 3, title: "Review machine learning notes", subject: "AI & ML", minutes: 40, priority: "High", done: true },
];

const subjectColors = {
  "Web Development": "violet",
  "AI & ML": "blue",
  "Database": "orange",
  "DSA": "green",
  "Aptitude": "pink",
  "Other": "gray",
};

function readTasks() {
  try {
    const saved = localStorage.getItem("studysprint-tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  } catch {
    return initialTasks;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [filter, setFilter] = useState("All tasks");
  const [showForm, setShowForm] = useState(false);
  const [showPlanner, setShowPlanner] = useState(false);
  const [toast, setToast] = useState("");
  const [newTask, setNewTask] = useState({ title: "", subject: "Web Development", minutes: "30", priority: "Medium" });
  const [focusMinutes, setFocusMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    localStorage.setItem("studysprint-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setSecondsLeft((seconds) => {
        if (seconds <= 1) {
          setTimerRunning(false);
          setToast("Focus session complete — take a short break!");
          return 0;
        }
        return seconds - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  const completed = tasks.filter((task) => task.done).length;
  const totalMinutes = tasks.reduce((sum, task) => sum + Number(task.minutes || 0), 0);
  const completedMinutes = tasks.filter((task) => task.done).reduce((sum, task) => sum + Number(task.minutes || 0), 0);
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
  const filteredTasks = useMemo(() => {
    if (filter === "Completed") return tasks.filter((task) => task.done);
    if (filter === "Pending") return tasks.filter((task) => !task.done);
    return tasks;
  }, [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    if (!newTask.title.trim()) return;
    setTasks((current) => [{
      id: Date.now(),
      title: newTask.title.trim(),
      subject: newTask.subject,
      minutes: Math.max(5, Number(newTask.minutes) || 30),
      priority: newTask.priority,
      done: false,
    }, ...current]);
    setNewTask({ title: "", subject: "Web Development", minutes: "30", priority: "Medium" });
    setShowForm(false);
    setToast("Task added to your study plan");
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) => task.id === id ? { ...task, done: !task.done } : task));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
    setToast("Task removed");
  }

  function generatePlan() {
    const pending = tasks.filter((task) => !task.done).sort((a, b) => {
      const rank = { High: 0, Medium: 1, Low: 2 };
      return rank[a.priority] - rank[b.priority];
    });
    if (!pending.length) {
      setToast("All tasks are complete — add a new task first!");
      return;
    }
    setShowPlanner(true);
  }

  function resetTimer() {
    setTimerRunning(false);
    setSecondsLeft(focusMinutes * 60);
  }

  const minutesDisplay = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secondsDisplay = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={22} /></div>
          <div><strong>StudySprint</strong><span>Plan with purpose</span></div>
        </div>
        <div className="profile-card">
          <div className="avatar">S</div>
          <div><strong>My workspace</strong><span>Student dashboard</span></div>
          <ChevronDown size={16} className="muted-icon" />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <nav>
          <a className="nav-item active" href="#overview"><Activity size={18} /> Overview</a>
          <a className="nav-item" href="#tasks"><CheckCircle2 size={18} /> My tasks <span className="nav-count">{tasks.filter(t => !t.done).length}</span></a>
          <a className="nav-item" href="#focus"><AlarmClock size={18} /> Focus timer</a>
        </nav>
        <div className="sidebar-bottom">
          <div className="tip-icon"><Sparkles size={18} /></div>
          <strong>Small steps add up.</strong>
          <p>Consistent study sessions can make big goals feel manageable.</p>
          <div className="sidebar-progress"><span style={{ width: `${progress}%` }} /></div>
          <small>{progress}% of your tasks completed</small>
        </div>
        <div className="sidebar-footer"><span className="online-dot" /> Your progress is saved on this device</div>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div><p className="eyebrow">THURSDAY • YOUR PERSONAL WORKSPACE</p><h1>Good evening, learner <span>✦</span></h1><p className="subheading">A little progress today leads to better results tomorrow.</p></div>
          <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> Add a task</button>
        </header>

        <section className="hero-card">
          <div className="hero-copy">
            <div className="hero-badge"><Sparkles size={14} /> YOUR DAILY STUDY PLAN</div>
            <h2>Make today<br /><em>count.</em></h2>
            <p>Keep your priorities clear, focus on one thing at a time, and celebrate every completed task.</p>
            <button className="hero-button" onClick={generatePlan}>Build my plan <ArrowRight size={17} /></button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="art-card art-note"><BookOpen size={22} /><span>Learn</span><strong>One topic at a time</strong></div>
            <div className="art-card art-check"><Check size={20} /><div><strong>Progress!</strong><span>Keep going</span></div></div>
            <div className="art-center"><BrainCircuit size={48} /></div>
            <div className="art-star star-one">✦</div><div className="art-star star-two">✧</div>
          </div>
        </section>

        <section className="stats-grid" aria-label="Study statistics">
          <div className="stat-card"><div className="stat-icon purple"><Target size={19} /></div><p>Total tasks</p><strong>{tasks.length}</strong><span className="stat-note">Your current task list</span></div>
          <div className="stat-card"><div className="stat-icon green"><CheckCircle2 size={19} /></div><p>Completed</p><strong>{completed}<small> / {tasks.length}</small></strong><span className="stat-note">{progress}% completion rate</span></div>
          <div className="stat-card"><div className="stat-icon orange"><Clock3 size={19} /></div><p>Planned study time</p><strong>{Math.floor(totalMinutes / 60)}<small>h</small> {totalMinutes % 60}<small>m</small></strong><span className="stat-note">{completedMinutes} minutes completed</span></div>
          <div className="stat-card"><div className="stat-icon pink"><Flame size={19} /></div><p>Focus streak</p><strong>{completed ? 1 : 0}<small> day</small></strong><span className="stat-note">Complete a task to build momentum</span></div>
        </section>

        <section className="content-grid">
          <div className="panel tasks-panel" id="tasks">
            <div className="panel-heading"><div><p className="eyebrow">STAY ON TRACK</p><h3>Today's tasks</h3></div><button className="text-button" onClick={() => setShowForm(true)}><Plus size={16} /> Add new</button></div>
            <div className="filter-tabs">
              {["All tasks", "Pending", "Completed"].map((item) => <button key={item} className={filter === item ? "filter-tab selected" : "filter-tab"} onClick={() => setFilter(item)}>{item}</button>)}
            </div>
            <div className="task-list">
              {filteredTasks.map((task) => <article className={`task-row ${task.done ? "is-done" : ""}`} key={task.id}>
                <button className="task-check" aria-label={task.done ? "Mark task pending" : "Mark task complete"} onClick={() => toggleTask(task.id)}>{task.done ? <CheckCircle2 size={21} /> : <Circle size={21} />}</button>
                <div className="task-info"><strong>{task.title}</strong><div className="task-meta"><span className={`subject-dot ${subjectColors[task.subject] || "gray"}`} />{task.subject}<span>·</span><Clock3 size={13} />{task.minutes} min</div></div>
                <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                <button className="icon-button delete-button" aria-label="Delete task" onClick={() => deleteTask(task.id)}><Trash2 size={16} /></button>
              </article>)}
              {!filteredTasks.length && <div className="empty-state"><BookOpen size={25} /><strong>Nothing here yet</strong><span>Add a task or choose another filter.</span></div>}
            </div>
            <div className="panel-bottom"><span>{completed} of {tasks.length} tasks completed</span><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><strong>{progress}%</strong></div>
          </div>

          <div className="right-column">
            <div className="panel focus-panel" id="focus">
              <div className="panel-heading"><div><p className="eyebrow">DEEP WORK</p><h3>Focus timer</h3></div><div className="round-icon"><AlarmClock size={18} /></div></div>
              <p className="focus-description">Set aside distractions and work on one task.</p>
              <div className="timer-ring" style={{ "--timer-progress": `${(secondsLeft / (focusMinutes * 60 || 1)) * 100}%` }}><div className="timer-inner"><strong>{minutesDisplay}:{secondsDisplay}</strong><span>FOCUS TIME</span></div></div>
              <div className="timer-options"><button className={focusMinutes === 25 ? "active" : ""} onClick={() => {setFocusMinutes(25); setTimerRunning(false); setSecondsLeft(1500);}}>25 min</button><button className={focusMinutes === 50 ? "active" : ""} onClick={() => {setFocusMinutes(50); setTimerRunning(false); setSecondsLeft(3000);}}>50 min</button></div>
              <div className="timer-actions"><button className="primary-button timer-start" onClick={() => {if (secondsLeft === 0) setSecondsLeft(focusMinutes * 60); setTimerRunning(!timerRunning);}}>{timerRunning ? "Pause session" : "Start focusing"}</button><button className="reset-button" onClick={resetTimer}>Reset</button></div>
            </div>
            <div className="panel progress-panel">
              <div className="panel-heading"><div><p className="eyebrow">YOUR MOMENTUM</p><h3>Task progress</h3></div><TrendingUp size={20} className="muted-icon" /></div>
              <div className="progress-summary"><div><strong>{progress}%</strong><span>completed</span></div><div className="mini-chart"><span style={{height:"30%"}}/><span style={{height:"48%"}}/><span style={{height:"38%"}}/><span style={{height:"65%"}}/><span style={{height:"52%"}}/><span style={{height:`${Math.max(18, progress)}%`}}/></div></div>
              <div className="progress-track large"><span style={{ width: `${progress}%` }} /></div>
              <p className="progress-caption">{completed === tasks.length && tasks.length > 0 ? "Amazing! All your tasks are complete." : "Keep going — every task moves you forward."}</p>
            </div>
          </div>
        </section>

        <footer className="page-footer">Built with React · Vite · Lucide · LocalStorage <span>Study smart, not just hard <Sparkles size={13} /></span></footer>
      </main>

      {showForm && <div className="modal-backdrop" onMouseDown={(e) => {if (e.target === e.currentTarget) setShowForm(false);}}>
        <form className="modal" onSubmit={addTask}>
          <div className="modal-heading"><div><p className="eyebrow">BUILD YOUR ROUTINE</p><h2>Add a study task</h2></div><button type="button" className="icon-button" onClick={() => setShowForm(false)} aria-label="Close"><X size={20} /></button></div>
          <label>Task name<input autoFocus value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} placeholder="e.g. Practice React hooks" required maxLength={90} /></label>
          <div className="form-row"><label>Subject<select value={newTask.subject} onChange={(e) => setNewTask({...newTask, subject: e.target.value})}>{["Web Development", "AI & ML", "Database", "DSA", "Aptitude", "Other"].map(s => <option key={s}>{s}</option>)}</select></label><label>Minutes<input type="number" min="5" max="600" value={newTask.minutes} onChange={(e) => setNewTask({...newTask, minutes: e.target.value})} required /></label></div>
          <label>Priority<select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>{["High", "Medium", "Low"].map(p => <option key={p}>{p}</option>)}</select></label>
          <div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button" type="submit"><Plus size={17} /> Add task</button></div>
        </form>
      </div>}

      {showPlanner && <div className="modal-backdrop" onMouseDown={(e) => {if (e.target === e.currentTarget) setShowPlanner(false);}}>
        <div className="modal planner-modal">
          <div className="modal-heading"><div><p className="eyebrow">PRIORITY-FIRST ROUTINE</p><h2>Your suggested study plan</h2></div><button className="icon-button" onClick={() => setShowPlanner(false)} aria-label="Close"><X size={20} /></button></div>
          <p className="planner-note"><Sparkles size={16} /> This plan is generated locally from your pending tasks and priority settings. It does not call an AI service.</p>
          <div className="plan-list">{tasks.filter(t => !t.done).sort((a,b) => ({High:0,Medium:1,Low:2}[a.priority]-{High:0,Medium:1,Low:2}[b.priority])).map((task, i) => <div className="plan-item" key={task.id}><div className="plan-number">{i+1}</div><div><strong>{task.title}</strong><span>{task.subject} · {task.minutes} minutes</span></div><span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span></div>)}</div>
          <button className="primary-button full-button" onClick={() => setShowPlanner(false)}>Let's get started <ArrowRight size={17} /></button>
        </div>
      </div>}

      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}