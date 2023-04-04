import db from '../models';
require('dotenv').config();
import { Op } from 'sequelize';

async function deleteExpiredSchedules() {
    try {
        // Lấy ngày hôm nay trừ đi 3 ngày
        const now = new Date();
        now.setDate(now.getDate() - 7);

        // Lấy các bản ghi có trường date nhỏ hơn hôm nay 3 ngày
        const schedulesToDelete = await db.Schedule.findAll({
            where: {
                date: {
                    [Op.lt]: now.getTime(),
                },
            },
        });

        // Xoá các bản ghi
        await Promise.all(schedulesToDelete.map((schedule) => schedule.destroy()));

        console.log(`Deleted ${schedulesToDelete.length} schedules.`);
    } catch (err) {
        console.error('Error deleting schedules:', err);
    }
}

module.exports = { deleteExpiredSchedules };
