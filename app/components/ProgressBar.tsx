//
// Copyright (c) 2022 Matthew Penner
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
//

import { Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { useTransition } from 'remix';

const randomInt = (low: number, high: number) => {
	return Math.floor(Math.random() * (high - low) + low);
};

export function ProgressBar() {
	const interval = useRef<number>();
	const timeout = useRef<number>();

	const [continuous, setContinuous] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>();
	const [visible, setVisible] = useState<boolean>(false);

	const { state } = useTransition();

	useEffect(() => {
		if (state !== 'idle') {
			setContinuous(true);
			return;
		}

		setContinuous(false);
		setProgress(previous => (previous === undefined ? undefined : 100));
	}, [state]);

	useEffect(() => {
		return () => {
			if (timeout.current) {
				clearTimeout(timeout.current);
			}

			if (interval.current) {
				clearInterval(interval.current);
			}
		};
	}, []);

	useEffect(() => {
		setVisible((progress ?? 0) > 0);

		if (progress === 100) {
			timeout.current = setTimeout(() => {
				setProgress(undefined);
			}, 500);
		}
	}, [progress, setProgress]);

	useEffect(() => {
		if (!continuous) {
			if (interval.current) {
				clearInterval(interval.current);
			}

			return;
		}

		if (progress === undefined || progress === 0) {
			setProgress(randomInt(1, 5));
		}
	}, [continuous, progress, setProgress]);

	useEffect(() => {
		if (!continuous) {
			return;
		}

		if (interval.current) {
			clearInterval(interval.current);
		}

		if ((progress ?? 0) >= 90) {
			setProgress(90);
		} else {
			interval.current = setTimeout(() => {
				setProgress((progress ?? 0) + randomInt(1, 5));
			}, 333);
		}
	}, [continuous, progress, setProgress]);

	return (
		<div className="h-[2px] fixed z-10 w-full">
			<Transition
				appear
				unmount
				as={Fragment}
				show={visible}
				enter="transition-opacity duration-150"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="transition-opacity duration-150"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div
					className="h-full transition-all ease-in-out duration-[250ms] shadow-[0_-2px_6px_2px] dark:shadow-[0_-2px_10px_2px] shadow-sky-500 dark:shadow-sky-600 bg-sky-500 dark:bg-sky-600"
					style={{ width: progress === undefined ? '100%' : `${progress}%` }}
				/>
			</Transition>
		</div>
	);
}
