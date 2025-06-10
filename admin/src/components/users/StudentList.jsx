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
  const [loading, setLoading] = useState({
    pending: true,
    active: true
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Fetch pending registrations
      const pendingResponse = await fetch('http://localhost:5000/api/v2/pending-registrations', {
        credentials: 'include'
      });
      const pendingData = await pendingResponse.json();

      if (pendingData.success) {
        const pendingStudents = pendingData.pendingRegistrations
          .filter(reg => reg.Role.toLowerCase() === 'student')
          .map(reg => ({
            id: reg._id,
            userCode: reg.UserCode,
            name: reg.Name,
            role: reg.Role,
            login: reg.Login,
            dob: reg.DOB,
            status: 'pending'
          }));

        setStudents(prev => ({
          ...prev,
          pending: pendingStudents
        }));
      }

      // Fetch active students
      const activeResponse = await fetch('http://localhost:5000/api/v2/find-active-users', {
        credentials: 'include'
      });
      const activeData = await activeResponse.json();

      if (activeData.success) {
        const activeStudents = activeData.activeUsers
        .filter(reg => reg.Role.toLowerCase() === 'student')
        .map(user => ({
          id: user._id,
          userCode: user.UserCode,
          name: user.Name,
          role: user.Role,
          login: user.Login,
          dob: user.DOB,
          status: 'active'
        }));

        setStudents(prev => ({
          ...prev,
          active: activeStudents
        }));
      }
    } catch (error) {
      message.error('Không thể tải danh sách học viên');
    } finally {
      setLoading({
        pending: false,
        active: false
      });
    }
  };

  const handleApprove = async (student) => {
    try {
      const response = await fetch('http://localhost:5000/api/v2/handle-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          registrationId: student.id,
          action: 'approve'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Đã duyệt học viên ${student.name}`);
        fetchStudents();
      } else {
        message.error('Không thể duyệt học viên');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi duyệt học viên');
    }
  };

  const handleReject = async (student) => {
    try {
      const response = await fetch('http://localhost:5000/api/v2/handle-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          registrationId: student.id,
          action: 'reject'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Đã từ chối học viên ${student.name}`);
        fetchStudents();
      } else {
        message.error('Không thể từ chối học viên');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi từ chối học viên');
    }
  };

  const handleDelete = async (student) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${student.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Đã xóa học viên ${student.name}`);
        fetchStudents();
      } else {
        message.error('Không thể xóa học viên');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa học viên');
    }
  };

  const activeColumns = [
    { title: 'Mã học viên', dataIndex: 'userCode', key: 'userCode' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'login', key: 'login' },
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
        <TabPane tab="Đang hoạt động" key="active">
          <Table
            dataSource={students.active}
            columns={activeColumns}
            rowKey="id"
            loading={loading.active}
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
            <p><strong>Mã học viên:</strong> {selectedStudent.userCode}</p>
            <p><strong>Họ tên:</strong> {selectedStudent.name}</p>
            <p><strong>Vai trò:</strong> Học viên</p>
            <p><strong>Email:</strong> {selectedStudent.login}</p>
            <p><strong>Ngày sinh:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</p>
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