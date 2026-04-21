import { request } from 'umi';

// Dữ liệu mock
let mockTags = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Frontend', 'Backend', 'Web Performance'];

const sampleTitles = [
  'Hướng dẫn cơ bản về React Hooks cho người mới bắt đầu',
  'Tìm hiểu Server-Side Rendering (SSR) với Next.js',
  'Tại sao bạn nên chuyển sang TypeScript ngay hôm nay',
  'Xây dựng RESTful API chuẩn REST với Node.js và Express',
  '10 mẹo tối ưu hóa hiệu suất web mà bạn nên biết',
  'Giới thiệu về Tailwind CSS: Ưu và nhược điểm',
  'Thiết kế kiến trúc Microservices cơ bản',
  'Các lỗi thường gặp khi làm việc với React và cách khắc phục',
  'Hướng dẫn viết Unit Test trong React với Jest và React Testing Library',
  'Làm thế nào để quản lý state hiệu quả với Redux Toolkit'
];

const sampleDescriptions = [
  'React Hooks đã thay đổi hoàn toàn cách chúng ta viết component. Cùng tìm hiểu các hooks cơ bản như useState, useEffect.',
  'SSR mang lại trải nghiệm tốt hơn cho SEO và tốc độ tải trang. Bài viết này sẽ giúp bạn hiểu rõ cách hoạt động của Next.js.',
  'TypeScript giúp phát hiện lỗi sớm và cải thiện trải nghiệm developer. Khám phá những lý do tại sao nó lại được yêu thích đến vậy.',
  'Một hướng dẫn chi tiết từng bước về cách thiết kế và xây dựng API theo chuẩn REST sử dụng các công nghệ backend phổ biến.',
  'Hiệu suất web là yếu tố then chốt ảnh hưởng đến trải nghiệm người dùng. Dưới đây là 10 kỹ thuật giúp trang web của bạn load nhanh hơn.',
  'Tailwind CSS đang nổi lên như một hiện tượng. Liệu nó có thực sự tốt như lời đồn? Hãy cùng phân tích.',
  'Khái niệm Microservices là gì? Khi nào nên sử dụng và những thách thức khi triển khai kiến trúc này.',
  'Tổng hợp những sai lầm phổ biến của các lập trình viên mới làm quen với React và cách giải quyết chúng.',
  'Kiểm thử tự động giúp mã nguồn của bạn trở nên đáng tin cậy hơn. Tìm hiểu cách viết test cho các component React.',
  'Redux Toolkit giúp giảm bớt boilerplate code và làm cho việc sử dụng Redux trở nên dễ dàng và thú vị hơn.'
];

const sampleContents = [
  '<p>React Hooks là một tính năng được giới thiệu trong phiên bản React 16.8. Nó cho phép bạn sử dụng state và các tính năng khác của React mà không cần phải viết một class.</p><h3>Tại sao lại cần Hooks?</h3><p>Trước khi có hooks, việc chia sẻ logic giữa các components rất phức tạp, chủ yếu sử dụng HOC (Higher-Order Components) hoặc Render Props.</p>',
  '<p>Next.js là một framework React được xây dựng để hỗ trợ SSR và SSG (Static Site Generation) một cách dễ dàng. Bằng cách render HTML ngay trên server, nó giúp tăng tốc độ tải trang ban đầu đáng kể.</p><p>Các tính năng nổi bật bao gồm hệ thống file-system based routing và API routes.</p>',
  '<p>TypeScript là một siêu tập hợp của JavaScript, bổ sung thêm hệ thống kiểu tĩnh (static typing). Điều này giúp IDE có thể gợi ý code tốt hơn và phát hiện lỗi ngay trong lúc gõ mã.</p><ul><li>Bắt lỗi sớm (Compile time)</li><li>Hỗ trợ OOP tốt hơn</li><li>Dễ dàng refactor code</li></ul>',
  '<p>REST (REpresentational State Transfer) là một kiểu kiến trúc phần mềm dành cho các hệ thống phân tán. Trong bài viết này, chúng ta sẽ thiết lập một server với Node.js và Express để tạo ra một API quản lý bài viết.</p><p>Các HTTP method chính bao gồm: GET, POST, PUT, DELETE.</p>',
  '<p>Tối ưu hóa hình ảnh, sử dụng Lazy Loading, và minify CSS/JS là một vài trong số những cách hiệu quả để cải thiện hiệu suất trang web.</p><p>Bên cạnh đó, việc sử dụng CDN (Content Delivery Network) cũng đóng vai trò quan trọng trong việc phục vụ tài nguyên tĩnh nhanh hơn đến tay người dùng trên toàn cầu.</p>',
  '<p>Tailwind CSS sử dụng cách tiếp cận utility-first. Thay vì viết các class CSS tùy chỉnh, bạn sử dụng các class có sẵn của Tailwind trực tiếp trong HTML.</p><p>Ưu điểm lớn nhất là bạn không phải lo nghĩ về việc đặt tên class và file CSS không bao giờ phình to quá mức.</p>',
  '<p>Microservices chia ứng dụng lớn thành các dịch vụ nhỏ hơn, độc lập với nhau. Mỗi dịch vụ chạy trong một tiến trình riêng và giao tiếp thông qua cơ chế nhẹ, thường là HTTP API.</p><p>Tuy nhiên, kiến trúc này cũng mang lại sự phức tạp trong việc triển khai và theo dõi lỗi (monitoring).</p>',
  '<p>Một trong những lỗi thường gặp nhất là thay đổi state trực tiếp mà không thông qua hàm setState, dẫn đến việc giao diện không được cập nhật lại (re-render).</p><p>Ngoài ra, việc quên cung cấp key cho các phần tử trong một list cũng gây ra những lỗi cảnh báo và hiệu năng không mong muốn.</p>',
  '<p>Viết Unit Test là một thói quen tốt cần có của mọi lập trình viên chuyên nghiệp. Với Jest, chúng ta có một framework test đầy đủ tính năng. Kết hợp cùng React Testing Library, việc test component mô phỏng lại cách người dùng tương tác trở nên dễ dàng.</p>',
  '<p>Redux là thư viện quản lý state rất mạnh mẽ. Tuy nhiên, Redux truyền thống thường bị phàn nàn là quá nhiều boilerplate code. Redux Toolkit ra đời để giải quyết vấn đề này.</p><p>Với hàm <code>configureStore</code> và <code>createSlice</code>, bạn có thể thiết lập Redux store chỉ trong vài dòng code.</p>'
];

// Hàm tạo slug đơn giản kiểu sinh viên hay làm
const toSlug = (str: string) => {
  return str.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/([^0-9a-z-\s])/g, '-')
    .replace(/(\s+)/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

let mockPosts = Array.from({ length: 25 }).map((_, i) => {
  const titleIdx = i % sampleTitles.length;
  const tagCount = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
  const tags = [...mockTags].sort(() => 0.5 - Math.random()).slice(0, tagCount);
  const title = sampleTitles[titleIdx] + (i >= sampleTitles.length ? ` (Phần ${Math.floor(i / sampleTitles.length) + 1})` : '');
  
  return {
    id: `${i + 1}`,
    title: title,
    slug: toSlug(title),
    thumbnail: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png', // Ảnh demo của antd
    content: sampleContents[titleIdx],
    description: sampleDescriptions[titleIdx],
    tags: tags,
    author: ['Nguyễn Văn A', 'Trần Thị B', 'Lê Hoàng C', 'Phạm Minh D'][i % 4],
    viewCount: Math.floor(Math.random() * 5000) + 100,
    status: i % 4 === 0 ? 'draft' : 'published', // Cứ 4 bài thì 1 bài nháp
    createdAt: new Date(Date.now() - (Math.random() * 30 * 86400000)).toISOString(),
  };
});

export async function getPosts(params: { page?: number; limit?: number; search?: string; tag?: string; status?: string }) {
  // console.log("getPosts params:", params); // Thêm log kiểu sinh viên hay debug
  const { page = 1, limit = 9, search = '', tag = '', status = '' } = params;
  let data = [...mockPosts];

  if (search) {
    data = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (tag) {
    data = data.filter(p => p.tags.includes(tag));
  }
  if (status) {
    data = data.filter(p => p.status === status);
  }

  // Mặc định trang chủ chỉ lấy bài published nếu không truyền status (hoặc xử lý ở UI)
  // Nhưng để linh hoạt, mình cứ trả về theo yêu cầu của params

  const total = data.length;
  const start = (page - 1) * limit;
  data = data.slice(start, start + limit);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data, total, success: true });
    }, 400);
  });
}

export async function getPostDetail(id: string) {
  const post = mockPosts.find(p => p.id === id);
  if (post) {
    post.viewCount += 1; // Tăng view giả lập
  }
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: post, success: !!post });
    }, 200);
  });
}

export async function createPost(data: any) {
  const newPost = {
    ...data,
    id: Date.now().toString(),
    viewCount: 0,
    createdAt: new Date().toISOString(),
    // Nếu ko nhập ảnh thì lấy ảnh mặc định
    thumbnail: data.thumbnail || 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png'
  };
  mockPosts.unshift(newPost);
  return { success: true, data: newPost };
}

export async function updatePost(id: string, data: any) {
  const idx = mockPosts.findIndex(p => p.id === id);
  if (idx > -1) {
    mockPosts[idx] = { ...mockPosts[idx], ...data };
    return { success: true };
  }
  return { success: false };
}

export async function deletePost(id: string) {
  mockPosts = mockPosts.filter(p => p.id !== id);
  return { success: true };
}

export async function getTags() {
  const tagData = mockTags.map(tag => {
    return {
      name: tag,
      count: mockPosts.filter(p => p.tags.includes(tag)).length
    }
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: tagData, success: true });
    }, 300);
  });
}

export async function addTag(tag: string) {
  if (!mockTags.includes(tag)) {
    mockTags.push(tag);
  }
  return { success: true };
}

export async function updateTag(oldTag: string, newTag: string) {
  const idx = mockTags.indexOf(oldTag);
  if (idx > -1) {
    mockTags[idx] = newTag;
    // Cập nhật tag trong các bài viết
    mockPosts = mockPosts.map(p => ({
      ...p,
      tags: p.tags.map(t => t === oldTag ? newTag : t),
    }));
  }
  return { success: true };
}

export async function deleteTag(tag: string) {
  mockTags = mockTags.filter(t => t !== tag);
  return { success: true };
}
