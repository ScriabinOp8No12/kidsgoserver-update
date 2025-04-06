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
import { avatar_list, Race } from "./avatar_list";

import "./Avatar.styl";

window["avatar_list"] = avatar_list;

export interface AvatarInterface {
    race: Race;
    idx: number;
    small?: boolean;
}

export function Avatar({ race, idx, small }: AvatarInterface): JSX.Element {
    // console.log("race, idx, small", race, idx, small);
    return (
        <div className={"Avatar" + (small ? " small" : "")}>
            <div className={`Avatar-svg avatar-${race}-${idx}`} />
        </div>
    );
}
