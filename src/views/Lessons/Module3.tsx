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
import { Content } from "./Content";
import { PuzzleConfig, Goban, JGOFNumericPlayerColor } from "goban";
import { openPopup } from "PopupDialog";
import { Axol } from "./Axol";

class Module3 extends Content {
    constructor() {
        super();
    }
}

class Page1 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Notice that this group has been completely surrounded on the outside, although it
                does still have two liberties inside.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4",
            },
        };
    }
}

class Page2 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If it is Black's turn, a play in the middle will create a group with two separate
                liberties inside. These are called eyes, and this group has two of them.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5g7",
                white: "d7d6e5f4g4d4",
            },
        };
    }
}

class Page3 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return (
            <p>
                One of the few rules in Go is that any stone played must have at least one liberty.
                Remember that taking a stone's last liberty will capture it. White cannot play at
                the triangled point because the stone wouldn't have any liberties.
            </p>
        );
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "c4d3d5e4",
                white: "",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("d4", "triangle");
    }
}

class Page4 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                White cannot play at either of the triangled points here, so Black can never come
                into atari. A group like this is said to be "alive," because it has two eyes.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5g7",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7g6", "triangle");
    }
}

class Page5 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>What happens if White gets to play in the middle first?</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        //goban.setMarkByPrettyCoord("f7g6", "triangle");
        goban.setMarkByPrettyCoord("g7", "1");
    }
}

class Page6 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                If Black tries to capture the stone by playing at 2, notice that Black is now in
                atari at A.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5g6",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        //goban.setMarkByPrettyCoord("f7g6", "triangle");
        goban.setMarkByPrettyCoord("g7g6", "1");
        goban.setMarkByPrettyCoord("g6", "2");
        goban.setMarkByPrettyCoord("f7", "A");
    }
}

class Page7 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                It looks like White can't play at A because there would be no liberties. However,
                because the Black group is in atari, White can play there. Playing at A captures six
                stones.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_player: "white",
            initial_state: {
                black: "e7e6f6f5g5g6",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        //goban.setMarkByPrettyCoord("f7g6", "triangle");
        //this.delay(() => goban.placeByPrettyCoord("f5"));
        //goban.engine.place(-1, -1);
        goban.engine.place(5, 0);
        goban.on("update", () => {
            if (goban.engine.board[0][5] === 2) {
                this.captureDelay(() => {
                    openPopup({
                        text: <Axol>Good job!</Axol>,
                        no_cancel: true,
                    })
                        .then(() => {
                            this.gotoNext();
                        })
                        .catch(() => 0);
                });
            }
        });

        //goban.setMarkByPrettyCoord("g7g6", "1");
        //goban.setMarkByPrettyCoord("g6", "2");
        //goban.setMarkByPrettyCoord("f7", "A");
    }
}

class Page8 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                So a Black play at A is obviously not a good move, and playing at B would also put
                Black's group into atari.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "A");
        goban.setMarkByPrettyCoord("g6", "B");
    }
}

class Page9 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                So perhaps Black decides not to play at either point. The group is not in atari, so
                what can White do anyway? Well, White can play at 1...
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7g6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g6", "1");
    }
}

class Page10 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Now Black is again in atari, and White could capture by playing at A. But wait,
                White is in atari too...
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4g7g6",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "A");
    }
}

class Page11 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>So Black can capture two stones with 1. Surely the group is okay now.</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5f7",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "1");
    }
}

class Page12 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                What happens if White plays at 2? It's true, White is also in atari, so Black can
                capture again...
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5f7",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("f7", "1");
        goban.setMarkByPrettyCoord("g7", "2");
    }
}

class Page13 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                But now the Black group only has a single liberty, which means White can capture the
                whole thing!
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5f7g6",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {}
}

class Page14 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>White plays at 1 and captures seven Black stones. Ouch.</p>];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "",
                white: "d7d6e5f4g4d4g7",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g7", "1");
    }
}

class Page15 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [
            <p>
                Looking again, we see that the placement of a single stone can make all the
                difference. Whoever gets to play at A will win this battle.
            </p>,
        ];
    }
    config(): PuzzleConfig {
        return {
            puzzle_player_move_mode: "fixed",
            initial_state: {
                black: "e7e6f6f5g5",
                white: "d7d6e5f4g4d4",
            },
        };
    }
    onSetGoban(goban: Goban): void {
        goban.setMarkByPrettyCoord("g7", "A");
    }
}

class Page16 extends Module3 {
    text(): JSX.Element | Array<JSX.Element> {
        return [<p>Good job learning about eyes so far, this is tricky stuff!</p>];
    }
    axolotlFace() {
        return true;
    }
}

export const module3: Array<typeof Content> = [
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,
    Page9,
    Page10,
    Page11,
    Page12,
    Page13,
    Page14,
    Page15,
    Page16,
];
