'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LogoLink() {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const role = localStorage.getItem('role');

    if (role === 'ADMIN') router.push('/admin');
    else if (role === 'USER') router.push('/user');
    else router.push('/');
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <span className="font-serif text-xl font-semibold text-gray-900">
        Tagebuch
      </span>
    </Link>
  );
}
