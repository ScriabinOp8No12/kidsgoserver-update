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
import Lottie, { LottieRefCurrentProps } from "lottie-react";

// The v04 airlock compositions close the doors over frames 0-24 and then just
// hold them closed; there is no authored opening, so the open is the close
// segment played in reverse.
const CLOSE_END_FRAME = 24;

interface AirlockRequest {
    animationData: object;
    onClosed: () => void;
}

let submit_request: ((req: AirlockRequest) => void) | null = null;

/**
 * Play the full-screen airlock door transition: the doors slide closed over
 * whatever is currently on screen, `onClosed` fires while they are fully shut
 * (navigate to the destination page there), then the doors slide open again
 * revealing whatever replaced it. If the animation data is missing or the
 * overlay host isn't mounted, `onClosed` is called immediately instead so the
 * caller still navigates.
 */
export function playAirlockTransition(animationData: object | null, onClosed: () => void): void {
    if (!animationData || !submit_request) {
        onClosed();
        return;
    }
    submit_request({ animationData, onClosed });
}

// Mounted once, above the router's page content, so the overlay survives the
// navigation that happens mid-transition while the doors are shut.
export function AirlockTransition(): JSX.Element | null {
    const [request, setRequest] = React.useState<AirlockRequest | null>(null);
    const phaseRef = React.useRef<"closing" | "opening">("closing");
    const lottieRef = React.useRef<LottieRefCurrentProps>(null);

    React.useEffect(() => {
        submit_request = (req) => {
            phaseRef.current = "closing";
            setRequest(req);
        };
        return () => {
            submit_request = null;
        };
    }, []);

    if (!request) {
        return null;
    }

    return (
        <div className="AirlockTransition">
            <Lottie
                lottieRef={lottieRef}
                animationData={request.animationData}
                loop={false}
                autoplay={false}
                onDOMLoaded={() => lottieRef.current?.playSegments([0, CLOSE_END_FRAME], true)}
                onComplete={() => {
                    if (phaseRef.current === "closing") {
                        phaseRef.current = "opening";
                        // Doors fully shut: swap the page underneath, then
                        // immediately start opening onto it.
                        request.onClosed();
                        lottieRef.current?.playSegments([CLOSE_END_FRAME, 0], true);
                    } else {
                        setRequest(null);
                    }
                }}
                className="airlock-square"
            />
        </div>
    );
}
