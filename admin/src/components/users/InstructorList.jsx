import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Tabs, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import './UserList.css';

const { TabPane } = Tabs;

const InstructorList = () => {
  const [instructors, setInstructors] = useState({
    pending: [],
    active: []
  });
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // TODO: Fetch instructors data from API
    // Temporary mock data
    setInstructors({
      pending: [
        {
          id: 1,
          usercode: 'INS001',
          name: 'Dr. Nguyen Van B',
          role: 'instructor',
          gmail: 'nguyenvanb@edu.vn',
          dob: '1980-01-01',
          password: '********',
          workplace: 'Faculty of Information Technology',
          status: 'pending'
        },
      ],
      active: [
        {
          id: 2,
          usercode: 'INS002',
          name: 'Dr. Tran Van C',
          role: 'instructor',
          gmail: 'tranvanc@edu.vn',
          dob: '1975-03-03',
          password: '********',
          workplace: 'Faculty of Computer Science',
          status: 'active'
        },
      ]
    });
  }, []);

  const handleApprove = (instructor) => {
    // TODO: Implement API call to approve instructor
    message.success(`Đã duyệt giảng viên ${instructor.name}`);
    setInstructors(prev => ({
      pending: prev.pending.filter(i => i.id !== instructor.id),
      active: [...prev.active, { ...instructor, status: 'active' }]
    }));
  };

  const handleReject = (instructor) => {
    // TODO: Implement API call to reject instructor
    message.success(`Đã từ chối giảng viên ${instructor.name}`);
    setInstructors(prev => ({
      ...prev,
      pending: prev.pending.filter(i => i.id !== instructor.id)
    }));
  };

  const handleDelete = (instructor) => {
    // TODO: Implement API call to delete instructor
    message.success(`Đã xóa giảng viên ${instructor.name}`);
    setInstructors(prev => ({
      ...prev,
      active: prev.active.filter(i => i.id !== instructor.id)
    }));
  };

  const pendingColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã giảng viên', dataIndex: 'usercode', key: 'usercode' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'gmail', key: 'gmail' },
    { title: 'Đơn vị', dataIndex: 'workplace', key: 'workplace' },
    {
      title: 'Trạng thái',
      key: 'status',
      render: () => (
        <span className="status-badge pending">Chờ duyệt</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            className="approve-btn"
            onClick={() => handleApprove(record)}
          >
            Duyệt
          </Button>
          <Button
            type="default"
            icon={<CloseOutlined />}
            className="reject-btn"
            onClick={() => handleReject(record)}
          >
            Từ chối
          </Button>
          <Button
            type="link"
            onClick={() => showInstructorDetails(record)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const activeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã giảng viên', dataIndex: 'usercode', key: 'usercode' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'gmail', key: 'gmail' },
    { title: 'Đơn vị', dataIndex: 'workplace', key: 'workplace' },
    {
      title: 'Trạng thái',
      key: 'status',
      render: () => (
        <span className="status-badge active">Đang hoạt động</span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_, record) => (
        <div className="action-buttons">
          <Popconfirm
            title="Xóa giảng viên"
            description="Bạn có chắc chắn muốn xóa giảng viên này?"
            onConfirm={() => handleDelete(record)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="default"
              icon={<DeleteOutlined />}
              danger
            >
              Xóa
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => showInstructorDetails(record)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const showInstructorDetails = (instructor) => {
    setSelectedInstructor(instructor);
    setIsModalVisible(true);
  };

  return (
    <div className="user-list-container">
      <h2>Quản lý giảng viên</h2>
      
      <Tabs defaultActiveKey="pending" className="user-list-tabs">
        <TabPane tab="Chờ duyệt" key="pending">
          <Table
            dataSource={instructors.pending}
            columns={pendingColumns}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Đang hoạt động" key="active">
          <Table
            dataSource={instructors.active}
            columns={activeColumns}
            rowKey="id"
          />
        </TabPane>
      </Tabs>

      <Modal
        title="Thông tin giảng viên"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedInstructor && (
          <div className="user-details">
            <p><strong>ID:</strong> {selectedInstructor.id}</p>
            <p><strong>Mã giảng viên:</strong> {selectedInstructor.usercode}</p>
            <p><strong>Họ tên:</strong> {selectedInstructor.name}</p>
            <p><strong>Vai trò:</strong> Giảng viên</p>
            <p><strong>Email:</strong> {selectedInstructor.gmail}</p>
            <p><strong>Ngày sinh:</strong> {selectedInstructor.dob}</p>
            <p><strong>Mật khẩu:</strong> {selectedInstructor.password}</p>
            <p><strong>Đơn vị:</strong> {selectedInstructor.workplace}</p>
            <p><strong>Trạng thái:</strong> 
              <span className={`status-badge ${selectedInstructor.status}`}>
                {selectedInstructor.status === 'pending' ? 'Chờ duyệt' : 'Đang hoạt động'}
              </span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InstructorList; 