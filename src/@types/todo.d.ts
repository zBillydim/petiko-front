export interface Todo {
  id: number
  task_title: string
  task_description: string
  due_date: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
}
