/*
 * Copyright (C) 2012-2020  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "BackButton";
//import { useState } from "react";
//import { Link } from "react-router-dom";
//import { _ } from "translate";
//import * as data from "data";
//import * as preferences from "preferences";
//import { errorAlerter, ignore } from "misc";

export function LearnToPlay(): JSX.Element {
    const navigate = useNavigate();

    function back() {
        navigate("/");
    }

    return (
        <div id="LearnToPlay">
            <BackButton onClick={back} />
            <div className="spacer" />
            <div className="background-container">
                <div className="back-background" />
                <div className="background">
                    <ChapterButton chapter={1} />
                    <div
                        className="chapter-text chapter-1-text"
                        onClick={() => navigateToChapter(1, navigate)}
                    >
                        Capturing Stones
                    </div>
                    <ChapterButton chapter={2} />
                    <div
                        className="chapter-text chapter-2-text"
                        onClick={() => navigateToChapter(2, navigate)}
                    >
                        Quest for Space
                    </div>
                    <ChapterButton chapter={3} />
                    <div
                        className="chapter-text chapter-3-text"
                        onClick={() => navigateToChapter(3, navigate)}
                    >
                        Eyes for Life
                    </div>
                    <ChapterButton chapter={4} />
                    <div
                        className="chapter-text chapter-4-text"
                        onClick={() => navigateToChapter(4, navigate)}
                    >
                        Ko Battles
                    </div>
                    <ChapterButton chapter={5} />
                    <div
                        className="chapter-text chapter-5-text"
                        onClick={() => navigateToChapter(5, navigate)}
                    >
                        Magic Moves
                    </div>
                    <ChapterButton chapter={6} />
                    <div className="chapter-text chapter-6-text">Coming Soon</div>
                    <ChapterButton chapter={7} />
                    <div className="chapter-text chapter-7-text">Coming Soon</div>
                    <ChapterButton chapter={8} />
                    <div className="chapter-text chapter-8-text">Coming Soon</div>
                </div>
            </div>
            <div className="spacer" />
        </div>
    );
}

function navigateToChapter(chapter: number, navigate) {
    if (chapter <= 5) {
        navigate(`/learn-to-play/${chapter}`);
    }
}

export function ChapterButton({ chapter }: { chapter: number }): JSX.Element {
    const navigate = useNavigate();

    return (
        <span
            className={"ChapterButton" + (chapter > 5 ? " disabled" : "") + ` chapter-${chapter}`}
            onClick={() => {
                if (chapter > 5) {
                    return;
                }
                navigate(`/learn-to-play/${chapter}`);
            }}
        >
            {chapter}
        </span>
    );
}
