import { useEffect, useRef, useState } from 'react';
import { Card, Row, Col, Pagination, Input, Select, Tag, Spin, Typography } from 'antd';
import { history } from 'umi';
import { getPosts, getTags } from '@/services/Blog';

const { Meta } = Card;
const { Paragraph } = Typography;

type BlogTag = {
  name: string;
  count: number;
};

const TrangChu = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [tags, setTags] = useState<BlogTag[]>([]);
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
    if (res?.success) setTags(res.data);
  };

  const fetchPosts = async () => {
    setLoading(true);
    const res: any = await getPosts({ page, limit: 9, search, tag });
    if (res?.success) {
      setPosts(res.data);
      setTotal(res.total);
    }
    setLoading(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1);
    }, 300);
  };

  return (
    <Card title="Blog Cá Nhân">
      <Row gutter={[16, 16]} style={{ marginBottom: 20 }}>
        <Col span={12}>
          <Input placeholder="Tìm kiếm bài viết..." onChange={handleSearch} allowClear />
        </Col>
        <Col span={12}>
          <Select
            style={{ width: '100%' }}
            placeholder="Lọc theo thẻ"
            allowClear
            value={tag || undefined}
            onChange={(value) => {
              setTag(value || '');
              setPage(1);
            }}
          >
            {tags.map((item) => (
              <Select.Option key={item.name} value={item.name}>
                {item.name} ({item.count})
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          {posts.map((post) => (
            <Col xs={24} sm={12} md={8} key={post.id}>
              <Card
                hoverable
                onClick={() => history.push(`/blog/chi-tiet/${post.id}`)}
                cover={
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    style={{ height: 180, objectFit: 'cover' }}
                  />
                }
              >
                <Meta
                  title={post.title}
                  description={
                    <div>
                      <Paragraph ellipsis={{ rows: 2 }}>{post.description}</Paragraph>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                        Tác giả: {post.author}
                      </div>
                      <div style={{ marginTop: 10 }}>
                        {post.tags?.map((item: string) => (
                          <Tag
                            color="blue"
                            key={item}
                            style={{ cursor: 'pointer' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setTag(item);
                              setPage(1);
                            }}
                          >
                            {item}
                          </Tag>
                        ))}
                      </div>
                      <div style={{ marginTop: 10, fontSize: 12, color: 'gray' }}>
                        {new Date(post.createdAt).toLocaleDateString()} - {post.author}
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <Pagination current={page} pageSize={9} total={total} onChange={(value) => setPage(value)} />
      </div>
    </Card>
  );
};

export default TrangChu;
