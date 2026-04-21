import React, { useEffect, useState, useRef } from 'react';
import { Card, Row, Col, Pagination, Input, Select, Tag, Spin, Typography } from 'antd';
import { history } from 'umi';
import { getPosts, getTags } from '@/services/Blog';

const { Meta } = Card;
const { Search } = Input;
const { Title, Paragraph, Text } = Typography;

const TrangChu = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  
  const timeoutRef = useRef<any>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [page, search, tag]);

  const fetchTags = async () => {
    const res: any = await getTags();
    if (res?.success) setTags(res.data || []);
  };

  const fetchPosts = async () => {
    setLoading(true);
    // Trang chủ chỉ hiện bài đã đăng
    const res: any = await getPosts({ page, limit: 9, search, tag, status: 'published' });
    if (res?.success) {
      setPosts(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1); // Reset về trang 1 khi search
    }, 300); // debounce 300ms
  };

  const handleTagClick = (e: React.MouseEvent, clickedTag: string) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra Card (tránh redirect)
    setTag(clickedTag);
    setPage(1);
  };

  return (
    <Card title="Blog Cá Nhân">
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Input 
            placeholder="Tìm kiếm bài viết..." 
            onChange={handleSearch} 
            allowClear 
          />
        </Col>
        <Col span={12}>
          <Select 
            style={{ width: '100%' }} 
            placeholder="Lọc theo thẻ (Tag)" 
            allowClear
            value={tag || undefined}
            onChange={(val) => {
              setTag(val);
              setPage(1);
            }}
          >
            {tags.map(t => (
              <Select.Option key={t.name} value={t.name}>{t.name} ({t.count})</Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {posts.map(post => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <Card
                hoverable
                onClick={() => history.push(`/blog/chi-tiet/${post.id}`)}
                cover={<img alt={post.title} src={post.thumbnail} style={{ height: 200, objectFit: 'cover' }} />}
              >
                <Meta 
                  title={post.title} 
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 2 }}>{post.description}</Paragraph>
                      <div style={{ marginTop: 10 }}>
                        {post.tags?.map((t: string) => (
                          <Tag 
                            color={tag === t ? "magenta" : "blue"} 
                            key={t} 
                            onClick={(e) => handleTagClick(e, t)}
                            style={{ cursor: 'pointer' }}
                          >
                            {t}
                          </Tag>
                        ))}
                      </div>
                      <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          Bởi <b>{post.author}</b>
                        </Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          👀 {post.viewCount} • {new Date(post.createdAt).toLocaleDateString()}
                        </Text>
                      </div>
                    </div>
                  } 
                />
              </Card>
            </Col>
          ))}
          {posts.length === 0 && !loading && (
            <div style={{ width: '100%', textAlign: 'center', marginTop: 50, color: 'gray' }}>
              Không tìm thấy bài viết nào!
            </div>
          )}
        </Row>
      </Spin>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Pagination 
          current={page} 
          pageSize={9} 
          total={total} 
          onChange={(p) => setPage(p)} 
        />
      </div>
    </Card>
  );
};

export default TrangChu;
