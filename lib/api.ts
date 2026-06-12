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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const data = err?.response?.data;
    if (data && typeof data === "object" && !data.succeeded) {
      const msg =
        (Array.isArray(data.errors) && data.errors.length ? data.errors.join("\n") : null) ??
        data.message ??
        "Request failed";
      return Promise.reject(new Error(msg));
    }
    return Promise.reject(err);
  }
);

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

// Lecturer enums
export enum AcademicRank {
  GraduateAssistant,
  AssistantLecturer,
  Lecturer,
  SeniorLecturer,
  AssociateProfessor,
  Professor,
}

export enum Qualification {
  Bachelor,
  Master,
  Doctorate,
}

export enum Specialization {
  Art,
  Business,
  Science,
  SocialSciences,
  Engineering,
  IT,
  Humanities,
  Medicine,
  Mathematics,
}

export interface LecturerItem {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  fullName: string;
  email: string;
  qualification: number;
  specialization: number;
  rank: number;
  yearsOfExperience: string;
  maxCourseLoad: string;
  isAvailable: boolean;
  allocatedCoursesCount: string;
  preferredLevels: string[];
  preferredCourses: string[];
}

export interface LecturersResponse {
  data: {
    items: LecturerItem[];
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

export interface LecturerResponse {
  data: LecturerItem;
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface CreateLecturerPayload {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  qualification: number;
  specialization: number;
  rank: number;
  yearsOfExperience: string;
  prefferedLevels: { levelId: string }[];
  preferedCourses: { courseId: string }[];
}

export interface GetLecturersParams {
  PageSize?: number;
  PageNumber?: number;
  SearchTerm?: string;
  "Sort.SortValue"?: string;
  "Sort.SortOrder"?: string;
}

export const getLecturers = (params?: GetLecturersParams) =>
  api.get<LecturersResponse>("/Lecturer", { params }).then((r) => r.data);

export const getLecturerById = (lecturerId: string) =>
  api.get<LecturerResponse>(`/Lecturer/${lecturerId}`).then((r) => r.data);

export const createLecturer = (payload: CreateLecturerPayload) =>
  api.post<BaseResponse>("/Lecturer/", payload).then((r) => r.data);

export const deleteLecturer = (lecturerId: string) =>
  api.delete<BaseResponse>(`/Lecturer/${lecturerId}`).then((r) => r.data);

export const toggleLecturerAvailability = (lecturerId: string) =>
  api.patch<BaseResponse>(`/Lecturer/${lecturerId}/toggle-availability`).then((r) => r.data);

// Course Allocation
export interface AllocatedCourse {
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  creditHours: string;
  level: {
    levelName: string;
    levelCode: string;
    id: string;
  };
  isElective: boolean;
  isGeneralStudies: boolean;
  requiredQualification: number;
  requiredSpecialization: number;
  department: string;
  faculty: string;
  allocatedOn: string;
}

export interface AllocatedCoursesResponse {
  data: AllocatedCourse[];
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export const manualAllocateCourses = (lecturerId: string, courseIds: string[]) =>
  api.post<BaseResponse>("/CourseAllocation/manual", { lecturerId, courseIds }).then((r) => r.data);

export const getAllocatedCourses = (lecturerId: string) =>
  api.get<AllocatedCoursesResponse>(`/CourseAllocation/lecturer/${lecturerId}`).then((r) => r.data);

export const reassignCourse = (fromLecturerId: string, toLecturerId: string, courseId: string) =>
  api.patch<BaseResponse>("/CourseAllocation/reassign", { fromLecturerId, toLecturerId, courseId }).then((r) => r.data);

export const removeCoursesFromLecturer = (lecturerId: string, courseIds: string[]) =>
  api.patch<BaseResponse>("/CourseAllocation/remove-courses-from-lecturer", { lecturerId, courseIds }).then((r) => r.data);

// Classroom Management
export enum ClassroomType {
  Lecture = 0,
  Lab = 1,
  Seminar = 2,
  Auditorium = 3,
}

export interface ClassroomItem {
  id: string;
  name: string;
  building: string;
  capacity: string;
  type: number;
  hasProjector: boolean;
  isAvailable: boolean;
  scheduleCount: string;
}

export interface ClassroomsResponse {
  data: ClassroomItem[];
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface ClassroomResponse {
  data: ClassroomItem;
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface ClassroomScheduleItem {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerId: string;
  lecturerName: string;
  classroomId: string;
  classroomName: string;
  day: number;
  startTime: string;
  endTime: string;
  status: number;
  academicSession: string;
  semester: string;
}

export interface ClassroomScheduleResponse {
  data: ClassroomScheduleItem[];
  statusCode: string;
  succeeded: boolean;
  message: string;
  errors: string[];
}

export interface CreateClassroomPayload {
  name: string;
  building: string;
  capacity: number;
  type: number;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  isAccessible: boolean;
}

export interface UpdateClassroomPayload {
  isAvailable: boolean;
  name: string;
  building: string;
  capacity: number;
  type: number;
  hasProjector: boolean;
  hasWhiteboard: boolean;
  isAccessible: boolean;
}

export interface GetClassroomsParams {
  type?: number;
  isAvailable?: boolean;
  minCapacity?: number;
}

export const getClassrooms = (params?: GetClassroomsParams) =>
  api.get<ClassroomsResponse>("/Classroom", { params }).then((r) => r.data);

export const createClassroom = (payload: CreateClassroomPayload) =>
  api.post<ClassroomResponse>("/Classroom", payload).then((r) => r.data);

export const getClassroomById = (id: string) =>
  api.get<ClassroomResponse>(`/Classroom/${id}`).then((r) => r.data);

export const getClassroomSchedule = (id: string, day?: string) =>
  api.get<ClassroomScheduleResponse>(`/Classroom/${id}/schedule`, { params: day ? { day } : {} }).then((r) => r.data);

export const updateClassroom = (id: string, payload: UpdateClassroomPayload) =>
  api.put<BaseResponse>(`/Classroom/${id}`, payload).then((r) => r.data);

export const deleteClassroom = (id: string) =>
  api.delete<BaseResponse>(`/Classroom/${id}`).then((r) => r.data);
