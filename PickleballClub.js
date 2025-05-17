import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Tesseract from 'tesseract.js';

export default function PickleballClub() {
    const [members, setMembers] = useState([]);
    const [events, setEvents] = useState([]);
    const [sponsors, setSponsors] = useState([]);
    const [newEvent, setNewEvent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedMembers = JSON.parse(localStorage.getItem('members')) || [];
        const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
        const storedSponsors = JSON.parse(localStorage.getItem('sponsors')) || [];
        setMembers(storedMembers);
        setEvents(storedEvents);
        setSponsors(storedSponsors);
    }, []);

    const addEvent = () => {
        if (newEvent.trim() === '') return;
        const updatedEvents = [...events, { name: newEvent, date: new Date().toLocaleDateString(), participants: [] }];
        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
        setNewEvent('');
        alert('Đã thêm sự kiện mới!');
    };

    const toggleParticipation = (eventIndex, memberName, status) => {
        const updatedEvents = [...events];
        const event = updatedEvents[eventIndex];
        const existingParticipant = event.participants.find(p => p.name === memberName);

        if (existingParticipant) {
            existingParticipant.status = status;
        } else {
            event.participants.push({ name: memberName, status });
        }

        setEvents(updatedEvents);
        localStorage.setItem('events', JSON.stringify(updatedEvents));
    };

    const exportReport = () => {
        const reportData = members.map(member => {
            const totalPenalties = events.reduce((sum, event) => {
                const participant = event.participants.find(p => p.name === member.name);
                if (participant && (participant.status === 'Không tham gia' || participant.status === 'Không bình chọn')) {
                    return sum + 50000;
                }
                return sum;
            }, 0);

            return {
                name: member.name,
                totalPenalties,
                participationCount: events.filter(event => event.participants.some(p => p.name === member.name && p.status === 'Tham gia')).length
            };
        });

        const csvContent = [
            ['Tên thành viên', 'Số lần tham gia', 'Tổng tiền phạt (VND)'],
            ...reportData.map(row => [row.name, row.participationCount, row.totalPenalties])
        ].map(e => e.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'pickleball_club_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setLoading(true);

        try {
            const { data } = await Tesseract.recognize(file, 'eng', {
                logger: (m) => console.log(m),
            });
            const text = data.text;
            console.log(text);

            const sponsorLines = text.split('\n').filter(line => line.trim() !== '');
            const newSponsors = sponsorLines.map(line => {
                const parts = line.split(/\s+/);
                const amount = parseInt(parts.pop().replace(/[^0-9]/g, ''), 10) || 0;
                const name = parts.join(' ').trim();
                return { name, amount };
            });

            const updatedSponsors = [...sponsors, ...newSponsors];
            setSponsors(updatedSponsors);
            localStorage.setItem('sponsors', JSON.stringify(updatedSponsors));
            alert('Đã cập nhật danh sách nhà tài trợ!');
        } catch (error) {
            console.error('Lỗi khi phân tích ảnh:', error);
            alert('Có lỗi xảy ra khi phân tích ảnh!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">CLB Pickleball - Thống kê thành viên</h1>
            <Card className="mb-4">
                <CardContent>
                    <h2 className="text-xl font-semibold">Danh sách nhà tài trợ</h2>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="mb-4" />
                    {loading ? <p>Đang phân tích ảnh...</p> : null}
                    <ul>
                        {sponsors.map((sponsor, index) => (
                            <li key={index} className="my-2">
                                {sponsor.name} - {sponsor.amount} VND
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>

            <Card className="mb-4">
                <CardContent>
                    <h2 className="text-xl font-semibold">Sự kiện tham gia</h2>
                    <input 
                        type="text" 
                        placeholder="Tên sự kiện (VD: Thứ 3, Thứ 5)" 
                        value={newEvent} 
                        onChange={(e) => setNewEvent(e.target.value)} 
                        className="border p-2 mb-4 w-full" />
                    <Button onClick={addEvent}>Thêm sự kiện</Button>
                    <Button className="mt-4" onClick={exportReport}>Xuất báo cáo</Button>
                </CardContent>
            </Card>
        </div>
    );
}
