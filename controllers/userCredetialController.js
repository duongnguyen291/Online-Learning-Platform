const fs = require('fs').promises;
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

// Khởi tạo file users.json nếu chưa tồn tại
const initUsersFile = async () => {
    try {
        await fs.access(USERS_FILE);
    } catch (error) {
        // File không tồn tại, tạo file mới
        const initialData = {
            users: [],
            lastUserCode: 0
        };
        await fs.writeFile(USERS_FILE, JSON.stringify(initialData, null, 2));
    }
};

// Đọc dữ liệu từ file JSON
const readUsersFile = async () => {
    try {
        await fs.access('controllers/users.json');
        return true;
    } catch (error)  {
        console.error('Lỗi đọc file users:', error);
        return false;
    }
};

// Ghi dữ liệu vào file JSON
const writeUsersFile = async (data) => {
    try {
        await fs.writeFile(USERS_FILE, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Lỗi ghi file users:', error);
        return false;
    }
};

const deleteUsersFile = async () => {
    try {
        await fs.unlink(USERS_FILE);
        console.log('File users.json đã được xóa thành công');
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log('File users.json không tồn tại');
            return true;
        }
        console.error('Lỗi xóa file users.json:', error);
        return false;
    }
};

module.exports = {initUsersFile, readUsersFile, writeUsersFile, deleteUsersFile};