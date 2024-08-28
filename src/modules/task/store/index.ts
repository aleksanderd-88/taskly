import { defineStore } from "pinia";
import API from '@/services/api'
import { TaskRequestType, TaskResponseType, TaskType } from "@/types/task";
import { useToastStore } from "@/modules/toast/stores";
import { ref } from "vue";

export const useTaskStore = defineStore('task', () => {

  const result = ref<TaskResponseType | null>(null)
  const task = ref<TaskType | null>(null)
  const mode = ref<'basic' | 'edit'>('basic')

  const createTask = async (params: TaskRequestType<TaskType>) => {
    try {
      await API.task.create(params)
    } catch (error) {
      console.log(`Error ==> ${ error }`);
      useToastStore()
      .setToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Unable to create task'
      })
    }
  }

  const listTasks = async (params: TaskRequestType<Pick<TaskType, 'projectId'>>) => {
    try {
      const { data } = await API.task.list(params)
      setResult(data)
    } catch (error) {
      console.log(`Error ==> ${ error }`);
    }
  }

  const getTask = async (id: string) => {
    try {
      const { data } = await API.task.get(id)
      setTask(data, 'basic')
    } catch (error) {
      console.log(`Error ==> ${ error }`);
    }
  }

  const updateTask = async (id: string, params: TaskRequestType<TaskType>) => {
    try {
      await API.task.update(id, params)
      useToastStore()
      .setToast({
        severity: 'success',
        summary: 'Success',
        detail: 'Task updated'
      })
    } catch (error) {
      console.log(`Error ==> ${ error }`);
      useToastStore()
      .setToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update task'
      })
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await API.task.delete(id)
      useToastStore()
      .setToast({
        severity: 'success',
        summary: 'Success',
        detail: 'Task deleted'
      })
    } catch (error) {
      console.log(`Error ==> ${ error }`);
      useToastStore()
      .setToast({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to delete task'
      })
    }
  }

  const setResult = (value: TaskResponseType) => result.value = value
  const setTask = (value: TaskType | null, selectedMode: 'basic' | 'edit') => {
    mode.value = selectedMode
    task.value = value
  }

  return {
    createTask,
    listTasks,
    result,
    getTask,
    task,
    setTask,
    mode,
    updateTask,
    deleteTask
  }
})