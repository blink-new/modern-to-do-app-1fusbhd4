
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskStore } from '../stores/taskStore';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { ArrowLeft } from 'lucide-react';

export function TaskPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { tasks, toggleTask, updateTask } = useTaskStore();
  
  const task = tasks.find(t => t.id === taskId);
  
  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 pt-8">
        <p>Task not found</p>
        <Button onClick={() => navigate('/')}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>
      
      <div className="flex items-center gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => toggleTask(task.id)}
          className="h-5 w-5"
        />
        <h1 className={`text-xl font-semibold ${task.completed ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h1>
      </div>
      
      {task.description && (
        <p className="text-gray-600">{task.description}</p>
      )}
    </div>
  );
}