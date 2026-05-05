import type { FC } from 'react';
import { useEffect } from 'react';
import { Col, DatePicker, Form, Input, Modal, Row, Select } from 'antd';
import moment from 'moment';
import type { Task, TaskPriority, TaskStatus } from '../typing';

const { TextArea } = Input;

interface TaskFormValues {
	title: string;
	description?: string;
	status: TaskStatus;
	deadline: moment.Moment;
	priority: TaskPriority;
	tags?: string[];
}

interface TaskFormModalProps {
	visible: boolean;
	editingTask?: Task;
	onCancel: () => void;
	onSubmit: (task: Omit<Task, 'id'>) => void;
}

const TaskFormModal: FC<TaskFormModalProps> = ({ visible, editingTask, onCancel, onSubmit }) => {
	const [form] = Form.useForm<TaskFormValues>();

	useEffect(() => {
		if (!visible) {
			form.resetFields();
			return;
		}

		if (editingTask) {
			form.setFieldsValue({
				title: editingTask.title,
				description: editingTask.description,
				status: editingTask.status,
				deadline: moment(editingTask.deadline),
				priority: editingTask.priority,
				tags: editingTask.tags,
			});
		} else {
			form.setFieldsValue({
				status: 'todo',
				priority: 'medium',
				tags: [],
			});
		}
	}, [editingTask, form, visible]);

	const getModalTitle = () => {
		if (editingTask) {
			return 'Chỉnh sửa công việc';
		}

		return 'Thêm công việc';
	};

	const getOkText = () => {
		if (editingTask) {
			return 'Cập nhật';
		}

		return 'Thêm mới';
	};

	const handleOk = async () => {
		const values = await form.validateFields();

		let tags: string[] = [];
		if (values.tags) {
			tags = values.tags;
		}

		const taskPayload: Omit<Task, 'id'> = {
			title: values.title.trim(),
			description: values.description?.trim(),
			status: values.status,
			deadline: values.deadline.format('YYYY-MM-DD'),
			priority: values.priority,
			tags,
		};

		onSubmit(taskPayload);
	};

	return (
		<Modal
			destroyOnClose
			width={720}
			visible={visible}
			title={getModalTitle()}
			okText={getOkText()}
			cancelText='Hủy'
			onCancel={onCancel}
			onOk={handleOk}
		>
			<Form form={form} layout='vertical'>
				<Form.Item
					label='Tiêu đề'
					name='title'
					rules={[
						{ required: true, message: 'Vui lòng nhập tiêu đề công việc' },
						{ max: 120, message: 'Tiêu đề không vượt quá 120 ký tự' },
					]}
				>
					<Input placeholder='Ví dụ: Hoàn thiện báo cáo tuần' />
				</Form.Item>

				<Form.Item label='Mô tả' name='description'>
					<TextArea rows={4} placeholder='Ghi chú ngắn về phạm vi hoặc kết quả mong muốn' />
				</Form.Item>

				<Row gutter={16}>
					<Col xs={24} md={8}>
						<Form.Item
							label='Deadline'
							name='deadline'
							rules={[{ required: true, message: 'Vui lòng chọn deadline' }]}
						>
							<DatePicker style={{ width: '100%' }} format='DD/MM/YYYY' />
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item label='Trạng thái' name='status' rules={[{ required: true }]}>
							<Select>
								<Select.Option value='todo'>Cần làm</Select.Option>
								<Select.Option value='inProgress'>Đang làm</Select.Option>
								<Select.Option value='done'>Hoàn thành</Select.Option>
							</Select>
						</Form.Item>
					</Col>
					<Col xs={24} md={8}>
						<Form.Item label='Ưu tiên' name='priority' rules={[{ required: true }]}>
							<Select>
								<Select.Option value='high'>Cao</Select.Option>
								<Select.Option value='medium'>Trung bình</Select.Option>
								<Select.Option value='low'>Thấp</Select.Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>

				<Form.Item label='Tags' name='tags'>
					<Select mode='tags' tokenSeparators={[',']} placeholder='Nhập tag và bấm Enter' />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default TaskFormModal;
