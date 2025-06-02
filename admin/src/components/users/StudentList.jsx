import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Tabs, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import './UserList.css';

const { TabPane } = Tabs;

const StudentList = () => {
  const [students, setStudents] = useState({
    pending: [],
    active: []
  });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    // TODO: Fetch students data from API
    // Temporary mock data
    setStudents({
      pending: [
        {
          id: 1,
          usercode: 'STU001',
          name: 'Nguyen Van A',
          role: 'student',
          gmail: 'nguyenvana@gmail.com',
          dob: '2000-01-01',
          password: '********',
          status: 'pending'
        },
      ],
      active: [
        {
          id: 2,
          usercode: 'STU002',
          name: 'Tran Thi B',
          role: 'student',
          gmail: 'tranthib@gmail.com',
          dob: '2000-02-02',
          password: '********',
          status: 'active'
        },
      ]
    });
  }, []);

  const handleApprove = (student) => {
    // TODO: Implement API call to approve student
    message.success(`Đã duyệt học viên ${student.name}`);
    setStudents(prev => ({
      pending: prev.pending.filter(s => s.id !== student.id),
      active: [...prev.active, { ...student, status: 'active' }]
    }));
  };

  const handleReject = (student) => {
    // TODO: Implement API call to reject student
    message.success(`Đã từ chối học viên ${student.name}`);
    setStudents(prev => ({
      ...prev,
      pending: prev.pending.filter(s => s.id !== student.id)
    }));
  };

  const handleDelete = (student) => {
    // TODO: Implement API call to delete student
    message.success(`Đã xóa học viên ${student.name}`);
    setStudents(prev => ({
      ...prev,
      active: prev.active.filter(s => s.id !== student.id)
    }));
  };

  const pendingColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã học viên', dataIndex: 'usercode', key: 'usercode' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'gmail', key: 'gmail' },
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
            onClick={() => showStudentDetails(record)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const activeColumns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Mã học viên', dataIndex: 'usercode', key: 'usercode' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'gmail', key: 'gmail' },
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
            title="Xóa học viên"
            description="Bạn có chắc chắn muốn xóa học viên này?"
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
            onClick={() => showStudentDetails(record)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const showStudentDetails = (student) => {
    setSelectedStudent(student);
    setIsModalVisible(true);
  };

  return (
    <div className="user-list-container">
      <h2>Quản lý học viên</h2>
      
      <Tabs defaultActiveKey="pending" className="user-list-tabs">
        <TabPane tab="Chờ duyệt" key="pending">
          <Table
            dataSource={students.pending}
            columns={pendingColumns}
            rowKey="id"
          />
        </TabPane>
        <TabPane tab="Đang hoạt động" key="active">
          <Table
            dataSource={students.active}
            columns={activeColumns}
            rowKey="id"
          />
        </TabPane>
      </Tabs>

      <Modal
        title="Thông tin học viên"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedStudent && (
          <div className="user-details">
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Mã học viên:</strong> {selectedStudent.usercode}</p>
            <p><strong>Họ tên:</strong> {selectedStudent.name}</p>
            <p><strong>Vai trò:</strong> Học viên</p>
            <p><strong>Email:</strong> {selectedStudent.gmail}</p>
            <p><strong>Ngày sinh:</strong> {selectedStudent.dob}</p>
            <p><strong>Mật khẩu:</strong> {selectedStudent.password}</p>
            <p><strong>Trạng thái:</strong> 
              <span className={`status-badge ${selectedStudent.status}`}>
                {selectedStudent.status === 'pending' ? 'Chờ duyệt' : 'Đang hoạt động'}
              </span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentList; 