export interface Question {
  id: string
  subjectId: string
  level: 'Dễ' | 'TB' | 'Khó' | 'Rất khó'
  blockId: string
  text: string
}

export interface KnowledgeBlock {
  id: string
  name: string
}

export interface Subject {
  id: string
  code: string
  name: string
  credit: number
}

export const subjects: Subject[] = [
  { id: 's1', code: 'MTH101', name: 'Toán', credit: 3 },
  { id: 's2', code: 'PHY201', name: 'Vật lý', credit: 4 },
  { id: 's3', code: 'CHE301', name: 'Hóa học', credit: 3 },
]

export const blocks: KnowledgeBlock[] = [
  { id: 'b1', name: 'Tổng quan' },
  { id: 'b2', name: 'Chuyên sâu' },
]

export const questions: Question[] = [
  { id: 'q1', subjectId: 's1', blockId: 'b1', level: 'Dễ', text: '1+1= ?' },
  { id: 'q2', subjectId: 's1', blockId: 'b1', level: 'TB', text: 'Tính tích phân...' },
  { id: 'q3', subjectId: 's1', blockId: 'b2', level: 'Khó', text: 'Chứng minh định lý...' },
  { id: 'q4', subjectId: 's1', blockId: 'b2', level: 'Rất khó', text: 'Giải phương trình...' },
  { id: 'q5', subjectId: 's2', blockId: 'b1', level: 'Dễ', text: 'Đơn vị của lực?' },
  { id: 'q6', subjectId: 's2', blockId: 'b2', level: 'TB', text: 'Định luật 2 Newton' },
  { id: 'q7', subjectId: 's2', blockId: 'b2', level: 'Khó', text: 'Bài toán momen lực' },
  { id: 'q8', subjectId: 's3', blockId: 'b1', level: 'Dễ', text: 'Công thức phân tử nước' },
  { id: 'q9', subjectId: 's3', blockId: 'b1', level: 'TB', text: 'Phản ứng thế' },
]