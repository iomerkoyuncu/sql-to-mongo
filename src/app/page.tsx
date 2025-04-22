'use client';
// pages/index.tsx
import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { sql } from '@codemirror/lang-sql';
import { json } from '@codemirror/lang-json';
import { dracula } from '@uiw/codemirror-theme-dracula';
import axios from 'axios';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export default function Home() {
	const [sqlQuery, setSqlQuery] = useState<string>(
		'SELECT * FROM users WHERE age > 18',
	);
	const [mongodbQuery, setMongodbQuery] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [showExamples, setShowExamples] = useState<boolean>(false);
	const [copied, setCopied] = useState<boolean>(false);

	const handleConvert = async () => {
		if (!sqlQuery.trim()) {
			setError('SQL sorgusu boş olamaz');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await fetch(
				'https://interview-with-ai-api.onrender.com/api/queries',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ prompt: sqlQuery }),
				},
			);

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || 'Conversion failed');
			}

			setMongodbQuery(JSON.stringify(data.result, null, 2));
		} catch (err) {
			setError(
				`Hata oluştu: ${
					err instanceof Error ? err.message : 'Bilinmeyen hata'
				}`,
			);
			console.error('Conversion error:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleCopyToClipboard = () => {
		if (mongodbQuery) {
			navigator.clipboard.writeText(JSON.parse(mongodbQuery));
			setCopied(true);
		}
	};

	const examples = [
		'SELECT * FROM users WHERE age > 30',
		'SELECT name, email FROM customers WHERE status = "active" ORDER BY name ASC LIMIT 10',
		'SELECT product_name, price FROM products WHERE category = "electronics" AND price < 500',
	];

	const handleSelectExample = (example: string) => {
		setSqlQuery(example);
		setShowExamples(false);
	};

	return (
		<div className='min-h-screen bg-gray-900 text-white p-4'>
			<header className='h-24 w-full p-3 mb-3'>
				<div className='w-4/5 container mx-auto h-full flex flex-wrap max-[700px]:justify-center items-center justify-between'>
					<div
						className='text-2xl font-semibold cursor-pointer'
						onClick={() => {
							window.location.href = '/';
						}}
					>
						<h6 className='text-2xl font-semibold cursor-pointer max-[700px]:text-sm p-2'>
							SQL to MongoDB Converter
						</h6>
					</div>
					<div className=' h-full flex  justify-center items-center p-2 m-2 '>
						<div className='flex flex-wrap justify-center items-center gap-2 '>
							<div className='flex justify-center items-center text-sm'>
								<a href='https://ismetomerkoyuncu.tech' target='_blank'>
									ismetomerkoyuncu
								</a>
							</div>

							<div className='flex justify-center items-center text-sm'>
								<p>2025</p>
							</div>
							<div
								className='flex justify-center items-center gap-2 border-2 p-1 border-white rounded-sm cursor-pointer'
								onClick={() => {
									window.location.href =
										'https://github.com/iomerkoyuncu/sql-to-mongo';
								}}
							>
								<span className='text-[10px]'> Give a Star on </span>

								<GitHubLogoIcon />
							</div>
						</div>
					</div>
				</div>
			</header>
			<div className='max-w-4xl mx-auto my-6'>
				<p className='text-center text-gray-400'>
					Convert your SQL query to MongoDB query format powered by AI.
				</p>
			</div>

			<main className='max-w-4xl mx-auto'>
				<div className='mb-6'>
					<div className='flex justify-between items-center mb-2'>
						<h2 className='text-xl font-semibold'>SQL Query</h2>
						<div className='relative'>
							<button
								className='text-sm text-blue-400 hover:text-blue-300'
								onClick={() => setShowExamples(!showExamples)}
							>
								Examples
							</button>
							{showExamples && (
								<div className='absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded shadow-lg z-10'>
									<div className='p-2'>
										{examples.map((example, index) => (
											<button
												key={index}
												className='block w-full text-left p-2 hover:bg-gray-700 text-sm rounded'
												onClick={() => handleSelectExample(example)}
											>
												{example}
											</button>
										))}
									</div>
								</div>
							)}
						</div>
					</div>
					<div className='border border-gray-700 rounded-md'>
						<CodeMirror
							value={sqlQuery}
							height='200px'
							extensions={[sql()]}
							onChange={(value) => setSqlQuery(value)}
							theme={dracula}
						/>
					</div>
					<div className='mt-4 flex gap-2 justify-center items-center w-full'>
						<button
							className='px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium flex items-center'
							onClick={handleConvert}
							disabled={loading}
						>
							{loading ? (
								<>
									<svg
										className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
										xmlns='http://www.w3.org/2000/svg'
										fill='none'
										viewBox='0 0 24 24'
									>
										<circle
											className='opacity-25'
											cx='12'
											cy='12'
											r='10'
											stroke='currentColor'
											strokeWidth='4'
										></circle>
										<path
											className='opacity-75'
											fill='currentColor'
											d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
										></path>
									</svg>
									Converting...
								</>
							) : (
								'Convert'
							)}
						</button>
					</div>
				</div>

				{error && (
					<div className='mb-6 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200'>
						{error}
					</div>
				)}

				<div className='mb-6'>
					<div className='flex justify-between items-center mb-2'>
						<h2 className='text-xl font-semibold'>MongoDB Query</h2>
						{mongodbQuery && (
							<button
								className='text-sm text-green-400 hover:text-green-300'
								onClick={handleCopyToClipboard}
							>
								{copied ? 'Copied!' : 'Copy to Clipboard'}
							</button>
						)}
					</div>
					<div className='border border-gray-700 rounded-md'>
						<CodeMirror
							value={mongodbQuery ? JSON.parse(mongodbQuery) : ''}
							height='200px'
							extensions={[json()]}
							theme={dracula}
							editable={false}
						/>
					</div>
				</div>
			</main>

			<footer className='max-w-4xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm'>
				<a
					href='https://ismetomerkoyuncu.com'
					target='_blank'
					rel='noopener noreferrer'
					className='text-gray-400 hover:text-gray-300'
				>
					ismetomerkoyuncu 2025
				</a>
			</footer>
		</div>
	);
}
