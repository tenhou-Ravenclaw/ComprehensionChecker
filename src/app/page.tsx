import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Lecture Voice AI</h1>
      <p className="mb-12 text-gray-600 text-lg text-center max-w-md">
        講義資料に基づいた対話型AIアシスタント。<br/>
        役割を選択してください。
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <Link 
          href="/teachers" 
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg transition duration-300 text-center flex flex-col items-center"
        >
          <span className="text-2xl mb-2">👨‍🏫</span>
          <span className="text-xl">Teacher</span>
          <span className="text-sm opacity-80 mt-1">講義資料を入力</span>
        </Link>
        
        <Link 
          href="/students" 
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-xl shadow-lg transition duration-300 text-center flex flex-col items-center"
        >
          <span className="text-2xl mb-2">🎓</span>
          <span className="text-xl">Student</span>
          <span className="text-sm opacity-80 mt-1">AIに質問する</span>
        </Link>
      </div>
    </div>
  );
}
