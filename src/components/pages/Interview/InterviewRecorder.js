import { useRef } from 'react';

const useInterviewRecorder = ({ videoRef, setRecordedChunks }) => {
    const mediaRecorderRef = useRef(null);

    // 녹화 시작
    const startRecording = () => {
        const stream = videoRef.current?.srcObject;
        if (stream) {
            try {
                mediaRecorderRef.current = new MediaRecorder(stream);
            } catch (error) {
                console.error('MediaRecorder initialization failed:', error);
                return;
            }
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prevChunks) => [...prevChunks, event.data]);
                }
            };
            mediaRecorderRef.current.start();
        } else {
            console.error('비디오 스트림을 찾을 수 없습니다.');
        }
    };

    // 녹화 일시 중지
    const pauseRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.pause();
        }
    };

    // 녹화 재개
    const resumeRecording = () => {
        if (!mediaRecorderRef.current) {
            console.error('미디어 레코더가 초기화되지 않았습니다.');
            return;
        }
        if (mediaRecorderRef.current.state === 'paused') {
            mediaRecorderRef.current.resume();
        } else {
            console.warn('녹화가 일시 중지된 상태가 아닙니다.');
        }
    };

    // 녹화 중지
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;  // 메모리 해제
        }
    };

    return { startRecording, pauseRecording, resumeRecording, stopRecording };
};

export default useInterviewRecorder;
