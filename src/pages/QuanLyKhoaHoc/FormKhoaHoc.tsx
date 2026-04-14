import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select } from 'antd';
import TinyEditor from '@/components/TinyEditor';

// Đã thêm ": any" ở cuối danh sách biến nhận vào
const FormKhoaHoc = ({ hienThi, tatModal, luuDuLieu, duLieuSua, mangTong }: any) => {
	const [formCaNhan] = Form.useForm();

	useEffect(() => {
		if (hienThi) {
			if (duLieuSua) {
				formCaNhan.setFieldsValue(duLieuSua);
			} else {
				formCaNhan.resetFields();
			}
		}
	}, [hienThi, duLieuSua, formCaNhan]);

	const nutLuuBam = () => {
		// Thêm ": any" cho giaTri và loi
		formCaNhan
			.validateFields()
			.then((giaTri: any) => {
				luuDuLieu(giaTri);
			})
			.catch((loi: any) => {
				console.log('Loi form', loi);
			});
	};

	return (
		<Modal
			title={duLieuSua ? 'Cập nhật thông tin khóa học' : 'Thêm mới khóa học'}
			visible={hienThi}
			onOk={nutLuuBam}
			onCancel={tatModal}
			width={900}
			destroyOnClose
		>
			<Form form={formCaNhan} layout='vertical'>
				<Form.Item
					name='tenKhoaHoc'
					label='Tên khóa học'
					rules={[
						{ required: true, message: 'Vui lòng không để trống tên' },
						{ max: 100, message: 'Chỉ được nhập tối đa 100 ký tự' },
						() => ({
							// Thêm ": any" vào tham số _ và gtri
							validator(_: any, gtri: any) {
								if (!gtri) return Promise.resolve();
								// Thêm ": any" vào biến k trong hàm find
								const kiemTraTrung = mangTong.find(
									(k: any) => k.tenKhoaHoc.trim().toLowerCase() === gtri.trim().toLowerCase() && k.id !== duLieuSua?.id,
								);
								if (kiemTraTrung) {
									return Promise.reject(new Error('Tên khóa học này đã tồn tại trong hệ thống rồi'));
								}
								return Promise.resolve();
							},
						}),
					]}
				>
					<Input placeholder='Nhập tên...' />
				</Form.Item>

				<Form.Item
					name='giangVien'
					label='Giảng viên phụ trách'
					rules={[{ required: true, message: 'Chọn một giảng viên' }]}
				>
					<Select placeholder='Chọn giảng viên'>
						<Select.Option value='Thầy Phan Tiến'>Thầy Phan Tiến</Select.Option>
						<Select.Option value='Cô Mai'>Cô Mai</Select.Option>
						<Select.Option value='Thầy Hùng'>Thầy Hùng</Select.Option>
						<Select.Option value='Cô Lan'>Cô Lan</Select.Option>
						<Select.Option value='Thầy Tuấn'>Thầy Tuấn</Select.Option>
						<Select.Option value='Cô Hương'>Cô Hương</Select.Option>
						<Select.Option value='Thầy Nam'>Thầy Nam</Select.Option>
						<Select.Option value='Cô Trang'>Cô Trang</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item
					name='soLuongHocVien'
					label='Số lượng học viên'
					rules={[{ required: true, message: 'Nhập số lượng' }]}
				>
					<InputNumber min={0} style={{ width: '100%' }} placeholder='0' />
				</Form.Item>

				<Form.Item
					name='trangThai'
					label='Trạng thái hiện tại'
					rules={[{ required: true, message: 'Chọn trạng thái' }]}
				>
					<Select placeholder='Tình trạng...'>
						<Select.Option value='Đang mở'>Đang mở</Select.Option>
						<Select.Option value='Đã kết thúc'>Đã kết thúc</Select.Option>
						<Select.Option value='Tạm dừng'>Tạm dừng</Select.Option>
					</Select>
				</Form.Item>

				<Form.Item name='moTa' label='Mô tả chi tiết khóa học'>
					<TinyEditor />
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default FormKhoaHoc;
