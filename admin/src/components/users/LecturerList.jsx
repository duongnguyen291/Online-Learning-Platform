import React, { useState, useEffect } from 'react';
import { Table, Modal, Button, Tabs, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined } from '@ant-design/icons';
import './UserList.css';

const { TabPane } = Tabs;

const LecturerList = () => {
  const [lecturers, setLecturers] = useState({
    pending: [],
    active: []
  });
  const [selectedLecturer, setSelectedLecturer] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState({
    pending: true,
    active: true
  });

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      // Fetch pending registrations
      const pendingResponse = await fetch('http://localhost:5000/api/v2/pending-registrations', {
        credentials: 'include'
      });
      const pendingData = await pendingResponse.json();

      if (pendingData.success) {
        const pendingLecturers = pendingData.pendingRegistrations
          .filter(reg => reg.Role.toLowerCase() === 'lecturer')
          .map(reg => ({
            id: reg._id,
            usercode: reg.UserCode,
            name: reg.Name,
            role: reg.Role,
            login: reg.Login,
            dob: reg.DOB,
            workplace: reg.Workplace || 'Chưa cập nhật',
            status: 'pending'
          }));

        setLecturers(prev => ({
          ...prev,
          pending: pendingLecturers
        }));
      }

      // Fetch active lecturers
      const activeResponse = await fetch('http://localhost:5000/api/v2/find-active-users', {
        credentials: 'include'
      });
      const activeData = await activeResponse.json();
      if (activeData.success) {
        const activeLecturers = activeData.activeUsers
        .filter(reg => reg.Role.toLowerCase() === 'lecturer')
        .map(user => ({
          id: user._id,
          usercode: user.UserCode,
          name: user.Name,
          role: user.Role,
          login: user.Login,
          dob: user.DOB,
          workplace: user.Workplace || 'Chưa cập nhật',
          status: 'active'
        }));

        setLecturers(prev => ({
          ...prev,
          active: activeLecturers
        }));
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      message.error('Không thể tải danh sách giảng viên');
    } finally {
      setLoading({
        pending: false,
        active: false
      });
    }
  };

  const handleApprove = async (lecturer) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/handle-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          registrationId: lecturer.id,
          action: 'approve'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Đã duyệt giảng viên ${lecturer.name}`);
        fetchLecturers();
      } else {
        message.error('Không thể duyệt giảng viên');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi duyệt giảng viên');
    }
  };

  const handleReject = async (lecturer) => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/admin/handle-registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          registrationId: lecturer.id,
          action: 'reject'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Đã từ chối giảng viên ${lecturer.name}`);
        fetchLecturers();
      } else {
        message.error('Không thể từ chối giảng viên');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi từ chối giảng viên');
    }
  };

  const handleDelete = async (lecturer) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/users/${lecturer.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(`Đã xóa giảng viên ${lecturer.name}`);
        fetchLecturers();
      } else {
        message.error('Không thể xóa giảng viên');
      }
    } catch (error) {
      message.error('Đã xảy ra lỗi khi xóa giảng viên');
    }
  };


  const activeColumns = [
    { title: 'Mã giảng viên', dataIndex: 'usercode', key: 'usercode' },
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'login', key: 'login' },
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
            onClick={() => showLecturerDetails(record)}
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  const showLecturerDetails = (lecturer) => {
    setSelectedLecturer(lecturer);
    setIsModalVisible(true);
  };

  return (
    <div className="user-list-container">
      <h2>Quản lý giảng viên</h2>
      
      <Tabs defaultActiveKey="pending" className="user-list-tabs">
        <TabPane tab="Đang hoạt động" key="active">
          <Table
            dataSource={lecturers.active}
            columns={activeColumns}
            rowKey="id"
            loading={loading.active}
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
        {selectedLecturer && (
          <div className="user-details">
            <p><strong>Mã giảng viên:</strong> {selectedLecturer.usercode}</p>
            <p><strong>Họ tên:</strong> {selectedLecturer.name}</p>
            <p><strong>Vai trò:</strong> Giảng viên</p>
            <p><strong>Email:</strong> {selectedLecturer.login}</p>
            <p><strong>Ngày sinh:</strong> {new Date(selectedLecturer.dob).toLocaleDateString()}</p>
            <p><strong>Đơn vị:</strong> {selectedLecturer.workplace}</p>
            <p><strong>Trạng thái:</strong> 
              <span className={`status-badge ${selectedLecturer.status}`}>
                {selectedLecturer.status === 'pending' ? 'Chờ duyệt' : 'Đang hoạt động'}
              </span>
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default LecturerList; 