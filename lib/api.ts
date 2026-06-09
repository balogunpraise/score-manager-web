import axios from "axios";
import { getToken } from "./auth";

const api = axios.create({
  baseURL: "https://localhost:7215/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Types
export interface LoginResponse {
  data: { userId: string; token: string; role: string };
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface CurrentUserResponse {
  data: {
    userId: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  };
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface BaseResponse {
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface CourseItem {
  id: string;
  courseCode: string;
  title: string;
  description: string;
  creditHours: number;
  departmentId: string;
  department?: {
    name: string;
    description: string;
    facultyId: string;
    id: string;
  };
}

export interface CoursesResponse {
  data: {
    items: CourseItem[];
    pageSize: number;
    currentPage: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface Department {
  id: string;
  name: string;
  description: string;
  facultyId: string;
}

export interface DepartmentsResponse {
  data: Department[];
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface Faculty {
  id: string;
  name: string;
  description: string;
}

export interface FacultiesResponse {
  data: Faculty[];
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface FacultyResponse {
  data: Faculty;
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface StudentItem {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  studentNumber: string;
  dateOfBirth: string;
  enrollmentDate: string;
  status: string;
  gpa: number;
  departmentId: string;
  levelId: string;
  userId: string;
  department: string;
  level: string;
}

export interface StudentsResponse {
  data: {
    items: StudentItem[];
    pageSize: number;
    currentPage: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface GetStudentsParams {
  PageSize?: number;
  PageNumber?: number;
  SearchTerm?: string;
  "Sort.SortValue"?: string;
  "Sort.SortOrder"?: string;
}

export interface GetCoursesParams {
  PageSize?: number;
  PageNumber?: number;
  SearchTerm?: string;
  "Sort.SortValue"?: string;
  "Sort.SortOrder"?: string;
}

export interface Level {
  id: string;
  levelName: string;
  levelCode: string;
}

export interface LevelsResponse {
  data?: Level[];
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface CreateStudentPayload {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  departmentId: string;
  levelId: string;
}

export const login = (email: string, password: string) =>
  api.post<LoginResponse>("/Auth/login", { email, password }).then((r) => r.data);

export const getCurrentUser = () =>
  api.get<CurrentUserResponse>("/Auth/current-user").then((r) => r.data);

export const getDepartments = (SearchTerm?: string) =>
  api.get<DepartmentsResponse>("/Department/get-departments", { params: { SearchTerm } }).then((r) => r.data);

export const getFaculties = (SearchTerm?: string) =>
  api.get<FacultiesResponse>("/Department/get-faculties", { params: { SearchTerm } }).then((r) => r.data);

export const getFacultyById = (facultyId: string) =>
  api.get<FacultyResponse>(`/Department/${facultyId}/get-faculties`).then((r) => r.data);

export const getCourses = (params?: GetCoursesParams) =>
  api.get<CoursesResponse>("/Course/get-all-courses", { params }).then((r) => r.data);

export const getStudents = (params?: GetStudentsParams) =>
  api.get<StudentsResponse>("/Student/get-students", { params }).then((r) => r.data);

export const createCourse = (payload: {
  courseCode: string;
  title: string;
  description: string;
  creditHours: number;
}) => api.post<BaseResponse>("/Course/create-course", payload).then((r) => r.data);

export const getLevels = (SearchTerm?: string) =>
  api.get<LevelsResponse>("/Level/get-levels", { params: { SearchTerm } }).then((r) => r.data);

export const createStudent = (payload: CreateStudentPayload) =>
  api.post<BaseResponse>("/Student/create-student", payload).then((r) => r.data);
