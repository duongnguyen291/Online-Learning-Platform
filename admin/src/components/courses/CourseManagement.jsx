import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form] = Form.useForm();

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v2/courses');
      const data = await response.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (error) {
      message.error('Failed to fetch courses');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handle Add/Edit Course
  const handleSubmit = async (values) => {
    try {
      const url = editingCourse
        ? `http://localhost:5000/api/v2/courses/${editingCourse._id}`
        : 'http://localhost:5000/api/v2/courses';
      
      const method = editingCourse ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      
      if (data.success) {
        message.success(editingCourse ? 'Course updated successfully' : 'Course added successfully');
        setIsModalVisible(false);
        form.resetFields();
        fetchCourses();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Operation failed');
    }
  };

  // Handle Delete Course
  const handleDelete = async (courseId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v2/courses/${courseId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        message.success('Course deleted successfully');
        fetchCourses();
      } else {
        message.error(data.message);
      }
    } catch (error) {
      message.error('Failed to delete course');
    }
  };

  const columns = [
    {
      title: 'Course Code',
      dataIndex: 'CourseCode',
      key: 'CourseCode',
    },
    {
      title: 'Name',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Lecturer',
      dataIndex: 'Lecturer',
      key: 'Lecturer',
    },
    {
      title: 'Required Role',
      dataIndex: 'RequiredRole',
      key: 'RequiredRole',
    },
    {
      title: 'Status',
      dataIndex: 'Status',
      key: 'Status',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCourse(record);
              form.setFieldsValue(record);
              setIsModalVisible(true);
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCourse(null);
            form.resetFields();
            setIsModalVisible(true);
          }}
        >
          Add New Course
        </Button>
      </div>

      <Table columns={columns} dataSource={courses} rowKey="_id" />

      <Modal
        title={editingCourse ? 'Edit Course' : 'Add New Course'}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="CourseCode"
            label="Course Code"
            rules={[{ required: true, message: 'Please input course code!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Name"
            label="Name"
            rules={[{ required: true, message: 'Please input course name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Description"
            label="Description"
            rules={[{ required: true, message: 'Please input course description!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Lecturer"
            label="Lecturer"
            rules={[{ required: true, message: 'Please input lecturer name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="RequiredRole"
            label="Required Role"
            rules={[{ required: true, message: 'Please input required role!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="Status"
            label="Status"
            rules={[{ required: true, message: 'Please input status!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingCourse ? 'Update' : 'Add'}
              </Button>
              <Button onClick={() => {
                setIsModalVisible(false);
                form.resetFields();
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CourseManagement; 