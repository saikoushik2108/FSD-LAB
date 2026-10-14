import { useEffect, useState } from "react";
import "./App.css";
function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState(
    JSON.parse(localStorage.getItem("tasks")) || []
  );
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const addTask = () => {
    if (!task.trim()) return;
    setTasks([...tasks, { text: task, done: false }]);
    setTask("");
  };

  const toggle = (i) => {
    const t = [...tasks];
    t[i].done = !t[i].done;
    setTasks(t);
  };

  const remove = (i) => setTasks(tasks.filter((_, x) => x !== i));

  return (
    <div className="container">
      <div className="todo-box">
        <h1>My ToDo List</h1>

        <div className="input-box">
          <input
            value={task}
            placeholder="Enter a task"
            onChange={(e) => setTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        <ul>
          {tasks.map((t, i) => (
            <li key={i}>
              <span className="task">
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(i)}
                />
                <span className={t.done ? "completed" : ""}>{t.text}</span>
              </span>
              <button onClick={() => remove(i)}>Delete</button>
            </li>
          ))}
        </ul>

        {!tasks.length && <p className="empty">No tasks yet</p>}
      </div>
    </div>
  );
}

export default App;