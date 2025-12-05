"use client";

import React, { useState, useEffect } from 'react';
import { useLecture } from '@/context/LectureContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeacherPage() {
  const { teacherContext, setTeacherContext } = useLecture();
  const [localContext, setLocalContext] = useState(teacherContext);
  const router = useRouter();
  
  // Sync local state with context on mount
  useEffect(() => {
    setLocalContext(teacherContext);
  }, [teacherContext]);

  const handleSave = () => {
    setTeacherContext(localContext);
    router.push('/students');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 flex items-center">
             &larr; Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-800">Teacher Mode</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <label className="block text-gray-700 text-lg font-semibold mb-4">
            講義資料 / コンテキスト入力
          </label>
          <p className="text-gray-500 mb-4 text-sm">
            AIに教えたい講義の内容や、生徒からの質問に答えるための知識を入力してください。
          </p>
          
          <textarea
            className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-800"
            placeholder="例: シュレーディンガーの猫は、量子力学における思考実験で..."
            value={localContext}
            onChange={(e) => setLocalContext(e.target.value)}
          />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow transition duration-300 flex items-center"
            >
              <span>設定を保存して生徒モードへ</span>
              <span className="ml-2">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

