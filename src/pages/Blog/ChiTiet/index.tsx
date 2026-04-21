import { useEffect, useState } from 'react';
import { Card, Typography, Tag, Divider, Spin, Row, Col, Avatar, Button } from 'antd';
import { useParams, history } from 'umi';
import { getPostDetail, getPosts } from '@/services/Blog';

const { Title, Paragraph, Text } = Typography;

const ChiTiet = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    const res: any = await getPostDetail(id);
    if (res?.success && res.data) {
      setPost(res.data);
      if (res.data.tags?.length > 0) {
        const relatedRes: any = await getPosts({ page: 1, limit: 3, tag: res.data.tags[0] });
        if (relatedRes?.success) {
          setRelatedPosts(relatedRes.data.filter((item: any) => item.id !== id));
        }
      }
    }
    setLoading(false);
  };

  if (loading) return <Spin style={{ display: 'block', margin: '50px auto' }} />;
  if (!post) return <Card>Không tìm thấy bài viết</Card>;

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Card>
        <Button style={{ marginBottom: 16 }} onClick={() => history.push('/blog/trang-chu')}>
          Quay lại danh sách
        </Button>

        <Title level={2}>{post.title}</Title>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <Avatar src="https://joeschmoe.io/api/v1/random" />
          <div style={{ marginLeft: 10 }}>
            <Text strong>{post.author}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(post.createdAt).toLocaleDateString()} - {post.viewCount} lượt xem
            </Text>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          {post.tags?.map((item: string) => <Tag color="blue" key={item}>{item}</Tag>)}
        </div>

        <Divider />

        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
          style={{ fontSize: 16, lineHeight: 1.8 }}
        />

        <Divider />

        <Title level={4}>Bài viết liên quan</Title>
        <Row gutter={[16, 16]}>
          {relatedPosts.map((item) => (
            <Col xs={24} sm={8} key={item.id}>
              <Card size="small" hoverable onClick={() => history.push(`/blog/chi-tiet/${item.id}`)}>
                <Card.Meta
                  title={item.title}
                  description={<Paragraph ellipsis={{ rows: 2 }}>{item.description}</Paragraph>}
                />
              </Card>
            </Col>
          ))}
          {relatedPosts.length === 0 && <Text type="secondary">Không có bài viết liên quan.</Text>}
        </Row>
      </Card>
    </div>
  );
};

export default ChiTiet;
