import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function SignUpPage() {
    // useState로 상태 관리..
    const [memberData, setMemberData] = useState({
        id: "",
        name: "",
        email: "",
        password: "",
        password2: ""
    });
    // 페이지 이동 제어
    const navigate = useNavigate();

    // 폼 데이터 변경 시 호출
    const handleChange = (event) => {
        const { name, value } = event.target;
        setMemberData({ ...memberData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { id, name, email, password, password2 } = memberData;

        if(memberData.password !== memberData.password2) {
          return alert('비밀번호와 비밀번호 확인이 같지 않습니다.')
      }    
        try {
          const response = await axios.post('/signup', memberData);
          console.log('서버 응답:', response.data);
          navigate('/signin');  // 회원가입 성공 시 로그인 페이지로 이동
        } catch (error) {
          console.error('서버 요청 오류:', error);
        }
      };


      return (
        <div className="flex items-center justify-center min-h-screen bg-white-100">
        <div className="w-full max-w-lg p-8 space-y-8">
          <h1 className="mt-10 text-center text-4xl font-bold leading-9 tracking-tight text-gray-900">회원가입</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="id" className="block text-sm font-medium leading-6 text-gray-900">아이디</label>
              <input
                type="text"
                name="id"
                id="id"
                value={memberData.id}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">이름</label>
              <input
                type="text"
                name="name"
                id="name"
                value={memberData.name}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">이메일</label>
              <input
                type="email"
                name="email"
                id="email"
                value={memberData.email}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                required
              />
            </div>
            <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">비밀번호</label>
              <input
                type="password"
                name="password"
                id="password"
                value={memberData.password}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                required
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="password2" className="block text-sm font-medium leading-6 text-gray-900">비밀번호 확인</label>
              <input
                type="password"
                name="password2"
                id="password2"
                value={memberData.password2}
                onChange={handleChange}
                className="w-full p-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-indigo-500"
                required
              />
            </div>
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-1/2 p-3 mt-10 text-white font-semibold bg-indigo-500 rounded-lg shadow-lg hover:bg-indigo-600">
                가입하기
              </button>
            </div>
          </form>
        </div>
      </div>
      );
};

export default SignUpPage;
