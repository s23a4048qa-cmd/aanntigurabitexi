/**
     * e東京喰種 パチンコ依存症克服シミュレーター コアロジック
     */

    document.addEventListener("DOMContentLoaded", () => {
        // --- 状態管理 (リアルタイム実践モード) ---
        const realtimeState = {
            currentRotation: 0,   // 現在の当たるまでの回転数
            totalRotation: 0,     // 累計回転数
            jackpotCount: 0,      // 大当り回数
            totalInvestment: 0,   // 総投資額 (円)
            totalOutBalls: 0,     // 総獲得出玉 (玉)
            totalReturnMoney: 0,  // 総回収額 (円)
            totalBalance: 0,      // トータル収支 (円)
            history: [],          // 大当り履歴
            isSpinning: false     // 回転アニメーション中か
        };

        // --- DOM要素 ---
        // タブ
        const tabButtons = document.querySelectorAll(".tab-btn");
        const tabContents = document.querySelectorAll(".tab-content");

        // 実践シミュレータ
        const numLeft = document.getElementById("num-left");
        const numCenter = document.getElementById("num-center");
        const numRight = document.getElementById("num-right");
        const screenMsg = document.getElementById("screen-msg");
        const currentRotationEl = document.getElementById("current-rotation");
        const totalRotationEl = document.getElementById("total-rotation");
        const jackpotCountEl = document.getElementById("jackpot-count");

        const totalInvestmentEl = document.getElementById("total-investment");
        const totalOutBallsEl = document.getElementById("total-out-balls");
        const totalReturnMoneyEl = document.getElementById("total-return-money");
        const totalBalanceEl = document.getElementById("total-balance");
        const balanceContainer = document.getElementById("balance-container");
        const historyList = document.getElementById("history-list");

        const btnSpin = document.getElementById("btn-spin");
        const btnSpin10 = document.getElementById("btn-spin-10");
        const btnSpinJackpot = document.getElementById("btn-spin-jackpot");
        const btnSpinRush = document.getElementById("btn-spin-rush");
        const btnResetRealtime = document.getElementById("btn-reset-realtime");

        // 大当りモーダル
        const jackpotModal = document.getElementById("jackpot-modal");
        const modalJpTitle = document.getElementById("modal-jp-title");
        const modalJpName = document.getElementById("modal-jp-name");
        const modalJpDetail = document.getElementById("modal-jp-detail");
        const modalRushStatus = document.getElementById("modal-rush-status");
        const modalCurrInvest = document.getElementById("modal-curr-invest");
        const modalCurrRot = document.getElementById("modal-curr-rot");
        const btnCloseModal = document.getElementById("btn-close-modal");

        // 長期統計モード
        const selectDays = document.getElementById("select-days");
        const btnRunBatch = document.getElementById("btn-run-batch");
        const batchTotalRot = document.getElementById("batch-total-rot");
        const batchTotalJp = document.getElementById("batch-total-jp");
        const batchTotalRush = document.getElementById("batch-total-rush");
        const batchRushRate = document.getElementById("batch-rush-rate");
        const batchMaxChain = document.getElementById("batch-max-chain");
        const batchAvgBalance = document.getElementById("batch-avg-balance");
        const batchWinRate = document.getElementById("batch-win-rate");
        const chartCanvas = document.getElementById("chart-canvas");

        // 依存症解説 & セルフチェック
        const accordionAdvice = document.getElementById("accordion-advice");
        const questionsContainer = document.getElementById("questions-container");
        const btnCalcScore = document.getElementById("btn-calc-score");
        const btnResetCheck = document.getElementById("btn-reset-check");
        const checkResultBox = document.getElementById("check-result");
        const checkScoreEl = document.getElementById("check-score");
        const checkEvalEl = document.getElementById("check-eval");
        const checkAdviceEl = document.getElementById("check-advice");
        const checkForm = document.getElementById("check-form");

        // 積立投資比較
        const inputMonthlyPachi = document.getElementById("input-monthly-pachi");
        const inputYears = document.getElementById("input-years");
        const inputInterest = document.getElementById("input-interest");
        const btnCalcInvest = document.getElementById("btn-calc-invest");
        const futurePachiTitle = document.getElementById("future-pachi-title");
        const futurePachiLost = document.getElementById("future-pachi-lost");
        const futureInvestTitle = document.getElementById("future-invest-title");
        const futureInvestGain = document.getElementById("future-invest-gain");
        const futureDiffValue = document.getElementById("future-diff-value");

        // --- 1. タブ切り替え ---
        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTab = btn.getAttribute("data-tab");
                
                tabButtons.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => c.classList.remove("active"));

                btn.classList.add("active");
                document.getElementById(targetTab).classList.add("active");

                // 長期統計タブが開かれた時、初期グラフを描画
                if (targetTab === "statistics") {
                    setTimeout(resizeCanvas, 50);
                }
            });
        });

        // --- 2. パチンコシミュレーション補助ロジック ---
        
        /**
         * 1回転の通常時抽選を実行する
         * @returns {Object|null} 大当たりした場合は詳細データ、ハズレはnull
         */
        function drawNormalSpin() {
            const rand = Math.random();
            const specs = eGhoulSpecs.probabilities;

            // 通常時合算確率は約 1/199.95
            // 図柄揃い(1/399.9) と 喰種チャージ(1/399.9) の合算
            if (rand < specs.normal合算) {
                // 大当たり！ 図柄揃いかチャージかを1:1で決定
                const randType = Math.random();
                const dists = eGhoulSpecs.distributions.heso;
                
                if (randType < 0.5) {
                    // 図柄揃い (10R, 1500発)
                    // 51%でRUSH突入、49%で通常
                    const isRush = Math.random() < 0.51;
                    return isRush ? dists[0] : dists[1];
                } else {
                    // 喰種チャージ (2R, 300発)
                    // 1%でRUSH突入、99%で通常
                    const isRush = Math.random() < 0.01;
                    return isRush ? dists[2] : dists[3];
                }
            }
            return null; // ハズレ
        }

        /**
         * RUSH中のST130回転をシミュレートする
         * @returns {Object} { chainCount: 連チャン数, totalBalls: RUSH中獲得出玉, payouts: 各当りの履歴リスト }
         */
        function simulateRush() {
            let chainCount = 0;
            let totalBalls = 0;
            let currentSt = eGhoulSpecs.probabilities.rushST回数;
            const rushProb = eGhoulSpecs.probabilities.rush実質;
            const payouts = [];

            while (currentSt > 0) {
                // RUSH中実質確率 1/95.3 の抽選
                const isHit = Math.random() < rushProb;
                if (isHit) {
                    chainCount++;
                    // 大当り振り分け: 3%が6000発(超ボーナス)、97%が3000発(通常)
                    const randDenchu = Math.random();
                    let hitDetail;
                    if (randDenchu < 0.03) {
                        hitDetail = eGhoulSpecs.distributions.denchu[0]; // 6000発
                    } else {
                        hitDetail = eGhoulSpecs.distributions.denchu[1]; // 3000発
                    }
                    
                    totalBalls += hitDetail.payout;
                    payouts.push(hitDetail);
                    
                    // RUSH回数リセット(ST130回復)
                    currentSt = eGhoulSpecs.probabilities.rushST回数;
                } else {
                    currentSt--;
                }
            }

            return { chainCount, totalBalls, payouts };
        }

        // --- 3. リアルタイム実践UI更新 ---
        
        // 投資額のリアル計算：1K(1000円)あたり16.5回転換算
        // 1回転あたりのコスト = 1000円 / 16.5回転 = 約60.6円
        function addRentCost(rotations) {
            const costPerSpin = 1000 / eGhoulSpecs.costs.border1K;
            realtimeState.totalInvestment += Math.round(rotations * costPerSpin);
        }

        function updateRealtimeUI() {
            currentRotationEl.textContent = realtimeState.currentRotation;
            totalRotationEl.textContent = realtimeState.totalRotation;
            jackpotCountEl.textContent = realtimeState.jackpotCount;

            totalInvestmentEl.textContent = realtimeState.totalInvestment.toLocaleString();
            totalOutBallsEl.textContent = realtimeState.totalOutBalls.toLocaleString();
            
            // 回収金額 = 獲得玉数 * 4円
            realtimeState.totalReturnMoney = realtimeState.totalOutBalls * eGhoulSpecs.costs.returnRate;
            totalReturnMoneyEl.textContent = realtimeState.totalReturnMoney.toLocaleString();

            // 収支計算
            realtimeState.totalBalance = realtimeState.totalReturnMoney - realtimeState.totalInvestment;
            totalBalanceEl.textContent = (realtimeState.totalBalance >= 0 ? "+" : "") + realtimeState.totalBalance.toLocaleString();

            // 収支表示の色と枠線の変更
            if (realtimeState.totalBalance >= 0) {
                balanceContainer.className = "rev-row border-green";
                totalBalanceEl.className = "val text-huge text-green";
            } else {
                balanceContainer.className = "rev-row border-red";
                totalBalanceEl.className = "val text-huge text-red";
            }
        }

        function addHistoryItem(jpData, rot, chain = 0, rushOutBalls = 0) {
            const item = document.createElement("div");
            const isCharge = jpData.id.includes("charge");
            item.className = "history-item" + (isCharge ? " charge" : "");

            const idx = realtimeState.history.length + 1;
            let textHtml = `<span class="jp-idx">#${idx}</span> `;
            
            if (chain > 0) {
                textHtml += `<span class="jp-name text-red">${jpData.name} RUSH突入! (${chain}連)</span>`;
                textHtml += `<span class="jp-rot">${rot}回転</span>`;
                textHtml += `<span class="jp-payout">+${(jpData.payout + rushOutBalls).toLocaleString()}玉</span>`;
            } else {
                textHtml += `<span class="jp-name">${jpData.name}</span>`;
                textHtml += `<span class="jp-rot">${rot}回転</span>`;
                textHtml += `<span class="jp-payout">+${jpData.payout.toLocaleString()}玉</span>`;
            }

            item.innerHTML = textHtml;
            
            // 履歴の先頭に追加
            if (historyList.querySelector(".empty-history")) {
                historyList.innerHTML = "";
            }
            historyList.insertBefore(item, historyList.firstChild);

            realtimeState.history.push({ jpData, rot, chain, rushOutBalls });
        }

        // 液晶演出アニメーション
        function animateReels(callback) {
            if (realtimeState.isSpinning) return;
            realtimeState.isSpinning = true;

            numLeft.className = "num spinning";
            numCenter.className = "num spinning";
            numRight.className = "num spinning";
            screenMsg.textContent = "SPINNING...";
            screenMsg.style.color = "var(--text-secondary)";

            setTimeout(() => {
                numLeft.className = "num";
                numCenter.className = "num";
                numRight.className = "num";
                realtimeState.isSpinning = false;
                callback();
            }, 600);
        }

        // 大当たり時のモーダル表示
        function showJackpotModal(jpData, currentRot, rushResult = null) {
            modalCurrRot.textContent = `${currentRot}回`;
            
            // 投資額計算
            const costPerSpin = 1000 / eGhoulSpecs.costs.border1K;
            const investThisTime = Math.round(currentRot * costPerSpin);
            modalCurrInvest.textContent = `${investThisTime.toLocaleString()}円`;

            modalJpName.textContent = jpData.name;
            if (jpData.id.includes("charge")) {
                modalJpName.className = "jp-name text-muted";
            } else {
                modalJpName.className = "jp-name text-red";
            }

            modalJpDetail.textContent = `初期出玉：${jpData.payout}玉`;

            if (jpData.rush && rushResult) {
                modalRushStatus.className = "rush-status win alert-pulse";
                modalRushStatus.innerHTML = `<i class="fa-solid fa-fire"></i> HYPER喰種RUSH突入！<br>${rushResult.chainCount}連チャン (RUSH追加：+${rushResult.totalBalls.toLocaleString()}玉)`;
            } else {
                modalRushStatus.className = "rush-status text-muted";
                modalRushStatus.textContent = jpData.rush ? "RUSH突入チャレンジ失敗..." : "喰種チャージ通常 (RUSH非突入)";
            }

            jackpotModal.classList.remove("hidden");
        }

        // 大当たり確定ボタン
        btnCloseModal.addEventListener("click", () => {
            jackpotModal.classList.add("hidden");
            // 液晶表示をリセット
            numLeft.textContent = "7";
            numCenter.textContent = "7";
            numRight.textContent = "7";
            numLeft.classList.remove("jackpot-hit");
            numCenter.classList.remove("jackpot-hit");
            numRight.classList.remove("jackpot-hit");
            screenMsg.textContent = "STANDBY";
            screenMsg.style.color = "var(--text-muted)";
        });

        // --- 4. 操作ボタンのイベント ---

        // 1回転回す
        btnSpin.addEventListener("click", () => {
            if (realtimeState.isSpinning) return;
            
            realtimeState.currentRotation++;
            realtimeState.totalRotation++;
            addRentCost(1);

            animateReels(() => {
                const hit = drawNormalSpin();
                if (hit) {
                    // 大当たり！
                    realtimeState.jackpotCount++;
                    const savedRotation = realtimeState.currentRotation;
                    realtimeState.currentRotation = 0;

                    // 液晶停止図柄を「7-7-7」にする
                    numLeft.textContent = "7";
                    numCenter.textContent = "7";
                    numRight.textContent = "7";
                    numLeft.classList.add("jackpot-hit");
                    numCenter.classList.add("jackpot-hit");
                    numRight.classList.add("jackpot-hit");
                    screenMsg.textContent = "!!! JACKPOT !!!";
                    screenMsg.style.color = "var(--neon-red)";

                    let rushResult = null;
                    if (hit.rush) {
                        rushResult = simulateRush();
                        realtimeState.totalOutBalls += (hit.payout + rushResult.totalBalls);
                        addHistoryItem(hit, savedRotation, rushResult.chainCount, rushResult.totalBalls);
                    } else {
                        realtimeState.totalOutBalls += hit.payout;
                        addHistoryItem(hit, savedRotation, 0, 0);
                    }

                    showJackpotModal(hit, savedRotation, rushResult);
                } else {
                    // ハズレ
                    const randDigit = () => Math.floor(Math.random() * 9) + 1;
                    let l = randDigit();
                    let c = randDigit();
                    let r = randDigit();
                    // ハズレなので三つ揃わないように調整
                    if (l === c && c === r) {
                        r = (r % 9) + 1;
                    }
                    numLeft.textContent = l;
                    numCenter.textContent = c;
                    numRight.textContent = r;
                    screenMsg.textContent = "HAZURE";
                }
                updateRealtimeUI();
            });
        });

        // 10回転回す
        btnSpin10.addEventListener("click", () => {
            if (realtimeState.isSpinning) return;

            animateReels(() => {
                let hitOccured = false;
                let hitData = null;
                let hitRot = 0;
                let totalSpins = 0;

                for (let i = 0; i < 10; i++) {
                    totalSpins++;
                    realtimeState.currentRotation++;
                    realtimeState.totalRotation++;
                    addRentCost(1);

                    const hit = drawNormalSpin();
                    if (hit) {
                        hitOccured = true;
                        hitData = hit;
                        hitRot = realtimeState.currentRotation;
                        realtimeState.currentRotation = 0;
                        realtimeState.jackpotCount++;
                        
                        // 残りの回転はキャンセル
                        break;
                    }
                }

                if (hitOccured) {
                    numLeft.textContent = "7";
                    numCenter.textContent = "7";
                    numRight.textContent = "7";
                    numLeft.classList.add("jackpot-hit");
                    numCenter.classList.add("jackpot-hit");
                    numRight.classList.add("jackpot-hit");
                    screenMsg.textContent = "!!! JACKPOT !!!";
                    screenMsg.style.color = "var(--neon-red)";

                    let rushResult = null;
                    if (hitData.rush) {
                        rushResult = simulateRush();
                        realtimeState.totalOutBalls += (hitData.payout + rushResult.totalBalls);
                        addHistoryItem(hitData, hitRot, rushResult.chainCount, rushResult.totalBalls);
                    } else {
                        realtimeState.totalOutBalls += hitData.payout;
                        addHistoryItem(hitData, hitRot, 0, 0);
                    }
                    
                    showJackpotModal(hitData, hitRot, rushResult);
                } else {
                    numLeft.textContent = "2";
                    numCenter.textContent = "45";
                    numCenter.textContent = "5";
                    numRight.textContent = "9";
                    screenMsg.textContent = "10回転消化完了";
                }
                updateRealtimeUI();
            });
        });

        // 当たるまで回す (超高速)
        btnSpinJackpot.addEventListener("click", () => {
            if (realtimeState.isSpinning) return;

            animateReels(() => {
                let currentRot = realtimeState.currentRotation;
                let hit = null;

                // 当たるまでループ
                while (!hit) {
                    currentRot++;
                    realtimeState.totalRotation++;
                    addRentCost(1);
                    hit = drawNormalSpin();
                }

                realtimeState.jackpotCount++;
                realtimeState.currentRotation = 0;

                numLeft.textContent = "7";
                numCenter.textContent = "7";
                numRight.textContent = "7";
                numLeft.classList.add("jackpot-hit");
                numCenter.classList.add("jackpot-hit");
                numRight.classList.add("jackpot-hit");
                screenMsg.textContent = `!!! ${currentRot}回目で当選 !!!`;
                screenMsg.style.color = "var(--neon-red)";

                let rushResult = null;
                if (hit.rush) {
                    rushResult = simulateRush();
                    realtimeState.totalOutBalls += (hit.payout + rushResult.totalBalls);
                    addHistoryItem(hit, currentRot, rushResult.chainCount, rushResult.totalBalls);
                } else {
                    realtimeState.totalOutBalls += hit.payout;
                    addHistoryItem(hit, currentRot, 0, 0);
                }

                showJackpotModal(hit, currentRot, rushResult);
                updateRealtimeUI();
            });
        });

        // RUSH突入まで回す (極限超高速)
        btnSpinRush.addEventListener("click", () => {
            if (realtimeState.isSpinning) return;

            animateReels(() => {
                let currentRot = realtimeState.currentRotation;
                let hit = null;
                let rushTriggered = false;
                let jpData = null;
                let totalInvestBeforeRush = 0;

                // RUSH突入まで無限ループ（恐ろしい大敗への旅）
                while (!rushTriggered) {
                    currentRot++;
                    realtimeState.totalRotation++;
                    addRentCost(1);

                    hit = drawNormalSpin();
                    if (hit) {
                        realtimeState.jackpotCount++;
                        jpData = hit;
                        if (hit.rush) {
                            rushTriggered = true;
                        } else {
                            // RUSHに入らなかった初当たり出玉を回収
                            realtimeState.totalOutBalls += hit.payout;
                            addHistoryItem(hit, currentRot, 0, 0);
                            currentRot = 0;
                        }
                    }
                }

                // RUSH突入！
                const savedRot = currentRot;
                realtimeState.currentRotation = 0;

                numLeft.textContent = "7";
                numCenter.textContent = "7";
                numRight.textContent = "7";
                numLeft.classList.add("jackpot-hit");
                numCenter.classList.add("jackpot-hit");
                numRight.classList.add("jackpot-hit");
                screenMsg.textContent = "HYPER喰種RUSH！";
                screenMsg.style.color = "var(--neon-green)";

                const rushResult = simulateRush();
                realtimeState.totalOutBalls += (jpData.payout + rushResult.totalBalls);
                addHistoryItem(jpData, savedRot, rushResult.chainCount, rushResult.totalBalls);

                showJackpotModal(jpData, savedRot, rushResult);
                updateRealtimeUI();
            });
        });

        // データリセット
        btnResetRealtime.addEventListener("click", () => {
            if (confirm("これまでの実践収支データが完全に消去されます。リセットしてよろしいですか？")) {
                realtimeState.currentRotation = 0;
                realtimeState.totalRotation = 0;
                realtimeState.jackpotCount = 0;
                realtimeState.totalInvestment = 0;
                realtimeState.totalOutBalls = 0;
                realtimeState.totalReturnMoney = 0;
                realtimeState.totalBalance = 0;
                realtimeState.history = [];
                realtimeState.isSpinning = false;

                numLeft.textContent = "7";
                numCenter.textContent = "7";
                numRight.textContent = "7";
                numLeft.className = "num";
                numCenter.className = "num";
                numRight.className = "num";
                screenMsg.textContent = "STANDBY";
                screenMsg.style.color = "var(--text-muted)";

                historyList.innerHTML = '<div class="empty-history">まだ大当りはありません。</div>';
                updateRealtimeUI();
            }
        });

        // --- 5. 長期統計シミュレータ＆グラフ描画 ---
        
        let batchChartInstance = null; // Canvasに描画するためのカスタムグラフ用データ

        // Canvasサイズ調整
        function resizeCanvas() {
            const rect = chartCanvas.parentElement.getBoundingClientRect();
            chartCanvas.width = rect.width;
            chartCanvas.height = rect.height;
            drawCustomChart();
        }

        window.addEventListener("resize", resizeCanvas);

        // バッチシミュレーションの実行
        btnRunBatch.addEventListener("click", () => {
            const days = parseInt(selectDays.value);
            // 1日約100回転として計算 (365日なら36,500回転)
            const targetSpins = days * 100;
            
            // 統計指標
            let totalSpins = 0;
            let totalJp = 0;
            let totalRush = 0;
            let maxChain = 0;
            let totalInvest = 0;
            let totalOutBalls = 0;
            
            // 折れ線グラフ用データ (最大100点に間引いてプロットする)
            const plotPoints = [];
            const step = Math.max(1, Math.floor(targetSpins / 100));

            // シミュレーション実行
            const costPerSpin = 1000 / eGhoulSpecs.costs.border1K;
            let currentRotationCount = 0;

            for (let spin = 1; spin <= targetSpins; spin++) {
                totalSpins++;
                currentRotationCount++;
                totalInvest += costPerSpin;

                const hit = drawNormalSpin();
                if (hit) {
                    totalJp++;
                    currentRotationCount = 0;
                    if (hit.rush) {
                        totalRush++;
                        const rushResult = simulateRush();
                        totalOutBalls += (hit.payout + rushResult.totalBalls);
                        if (rushResult.chainCount > maxChain) {
                            maxChain = rushResult.chainCount;
                        }
                    } else {
                        totalOutBalls += hit.payout;
                    }
                }

                if (spin % step === 0 || spin === targetSpins) {
                    const currentReturn = totalOutBalls * eGhoulSpecs.costs.returnRate;
                    const balance = currentReturn - totalInvest;
                    // 店の取り分 (還元率を約85%と仮定した期待的な損失推移)
                    const houseEdge = -Math.round(totalInvest * 0.15); // パチンコは一般に還元率80〜85%
                    
                    plotPoints.push({
                        spin: spin,
                        balance: Math.round(balance),
                        houseEdge: houseEdge
                    });
                }
            }

            const finalReturn = totalOutBalls * eGhoulSpecs.costs.returnRate;
            const finalBalance = Math.round(finalReturn - totalInvest);
            const roundedTotalInvest = Math.round(totalInvest);

            // UIの更新
            batchTotalRot.textContent = totalSpins.toLocaleString() + "回";
            batchTotalJp.textContent = totalJp.toLocaleString() + "回";
            batchTotalRush.textContent = totalRush.toLocaleString() + "回";
            
            const rushRateVal = totalJp > 0 ? ((totalRush / totalJp) * 100).toFixed(1) : "0.0";
            batchRushRate.textContent = rushRateVal + "%";
            batchMaxChain.textContent = maxChain + "連";
            
            batchAvgBalance.textContent = finalBalance.toLocaleString() + "円";
            if (finalBalance >= 0) {
                batchAvgBalance.className = "val font-orbit text-large text-green";
            } else {
                batchAvgBalance.className = "val font-orbit text-large text-red";
            }
            
            // --- 勝率 (長期的な勝率は、プラスで終えられる確率) ---
            // 大数の法則の冷酷さを示すため、裏で同じ条件のシミュレーションを20回行い、プラス収支で終えられた割合を勝率と定義する
            let winCount = 0;
            const simCount = 20;
            for (let s = 0; s < simCount; s++) {
                let sInvest = 0;
                let sOutBalls = 0;
                for (let spin = 1; spin <= targetSpins; spin++) {
                    sInvest += costPerSpin;
                    const hit = drawNormalSpin();
                    if (hit) {
                        if (hit.rush) {
                            const rushResult = simulateRush();
                            sOutBalls += (hit.payout + rushResult.totalBalls);
                        } else {
                            sOutBalls += hit.payout;
                        }
                    }
                }
                const sReturn = sOutBalls * eGhoulSpecs.costs.returnRate;
                if (sReturn - sInvest > 0) {
                    winCount++;
                }
            }

            const winRatePercent = ((winCount / simCount) * 100).toFixed(1);
            batchWinRate.textContent = winRatePercent + "%";
            if (winCount > 0) {
                batchWinRate.className = "val font-orbit text-green font-bold";
            } else {
                batchWinRate.className = "val font-orbit text-red font-bold";
            }

            // グラフ描画用データ保存
            batchChartInstance = plotPoints;
            drawCustomChart();
        });

        // Canvasによるカスタム収支グラフの描画
        function drawCustomChart() {
            if (!batchChartInstance || batchChartInstance.length === 0) {
                // 初期のプレースホルダー描画
                const ctx = chartCanvas.getContext("2d");
                ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);
                ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
                ctx.font = "14px 'Noto Sans JP'";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText("「運命を実行する」ボタンを押すと、収支グラフが描画されます", chartCanvas.width / 2, chartCanvas.height / 2);
                return;
            }

            const ctx = chartCanvas.getContext("2d");
            ctx.clearRect(0, 0, chartCanvas.width, chartCanvas.height);

            const padding = { top: 20, right: 30, bottom: 40, left: 65 };
            const graphWidth = chartCanvas.width - padding.left - padding.right;
            const graphHeight = chartCanvas.height - padding.top - padding.bottom;

            const data = batchChartInstance;
            const len = data.length;

            // X軸(回転数)の最大値
            const maxX = data[len - 1].spin;
            
            // Y軸(収支)の最大最小値の算出
            let minY = 0;
            let maxY = 0;
            data.forEach(p => {
                if (p.balance < minY) minY = p.balance;
                if (p.balance > maxY) maxY = p.balance;
                if (p.houseEdge < minY) minY = p.houseEdge;
            });

            // マージンを加える
            minY = minY * 1.1 - 10000;
            maxY = Math.max(10000, maxY * 1.1);

            // 座標変換関数
            const getX = (spin) => padding.left + (spin / maxX) * graphWidth;
            const getY = (bal) => padding.top + graphHeight - ((bal - minY) / (maxY - minY)) * graphHeight;

            // 1. グリッド線と軸の描画
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.lineWidth = 1;
            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.font = "10px Outfit";
            ctx.textAlign = "right";

            // Y軸目盛り(5分割)
            for (let i = 0; i <= 5; i++) {
                const yVal = minY + (i / 5) * (maxY - minY);
                const yPos = getY(yVal);
                
                // 横線
                ctx.beginPath();
                ctx.moveTo(padding.left, yPos);
                ctx.lineTo(chartCanvas.width - padding.right, yPos);
                ctx.stroke();

                // テキスト
                ctx.fillText(Math.round(yVal).toLocaleString() + "円", padding.left - 8, yPos + 3);
            }

            // X軸目盛り(回転数)
            ctx.textAlign = "center";
            for (let i = 0; i <= 4; i++) {
                const xVal = (i / 4) * maxX;
                const xPos = getX(xVal);

                // 縦線
                ctx.beginPath();
                ctx.moveTo(xPos, padding.top);
                ctx.lineTo(xPos, chartCanvas.height - padding.bottom);
                ctx.stroke();

                // テキスト
                ctx.fillText(Math.round(xVal).toLocaleString() + "回転", xPos, chartCanvas.height - padding.bottom + 15);
            }

            // 収支0円の基準線(太線)
            const zeroY = getY(0);
            if (zeroY >= padding.top && zeroY <= chartCanvas.height - padding.bottom) {
                ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(padding.left, zeroY);
                ctx.lineTo(chartCanvas.width - padding.right, zeroY);
                ctx.stroke();
            }

            // 2. パチンコ店の確実な取り分（ハウスエッジ）の描画
            ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
            ctx.lineWidth = 2;
            ctx.setLineDash([4, 4]); // 点線
            ctx.beginPath();
            ctx.moveTo(getX(data[0].spin), getY(data[0].houseEdge));
            for (let i = 1; i < len; i++) {
                ctx.lineTo(getX(data[i].spin), getY(data[i].houseEdge));
            }
            ctx.stroke();
            ctx.setLineDash([]); // 点線リセット

            // 3. あなたの収支の描画（ネオンレッド）
            ctx.strokeStyle = "#ff003c";
            ctx.lineWidth = 3;
            // ネオングロー効果
            ctx.shadowColor = "rgba(255, 0, 60, 0.5)";
            ctx.shadowBlur = 10;
            
            ctx.beginPath();
            ctx.moveTo(getX(data[0].spin), getY(data[0].balance));
            for (let i = 1; i < len; i++) {
                ctx.lineTo(getX(data[i].spin), getY(data[i].balance));
            }
            ctx.stroke();

            // シャドウ効果リセット
            ctx.shadowBlur = 0;

            // 収支がマイナス領域で終わっている場合、グラデーションで塗りつぶし
            ctx.fillStyle = "rgba(255, 0, 60, 0.05)";
            ctx.beginPath();
            ctx.moveTo(getX(data[0].spin), getY(0));
            for (let i = 0; i < len; i++) {
                ctx.lineTo(getX(data[i].spin), getY(data[i].balance));
            }
            ctx.lineTo(getX(data[len - 1].spin), getY(0));
            ctx.closePath();
            ctx.fill();
        }

        // --- 6. 依存症解説とセルフチェック診断 ---
        
        // 心理・仕組み解説アコーディオンの挿入
        function initAddictionAdvice() {
            accordionAdvice.innerHTML = "";
            addictionAdvice.forEach((item, index) => {
                const card = document.createElement("div");
                card.className = "advice-card";
                card.innerHTML = `
                    <h3><i class="fa-solid fa-triangle-exclamation"></i> ${item.title}</h3>
                    <p>${item.text}</p>
                `;
                accordionAdvice.appendChild(card);
            });
        }

        // セルフチェック質問の挿入
        function initSelfCheck() {
            questionsContainer.innerHTML = "";
            selfCheckQuestions.forEach((item, index) => {
                const row = document.createElement("label");
                row.className = "q-row";
                row.innerHTML = `
                    <input type="checkbox" name="q-${index}" value="${item.score}">
                    <span>${index + 1}. ${item.q}</span>
                `;
                questionsContainer.appendChild(row);
            });
        }

        // セルフチェックの点数計算
        btnCalcScore.addEventListener("click", () => {
            const checkboxes = questionsContainer.querySelectorAll("input[type='checkbox']:checked");
            let score = 0;
            checkboxes.forEach(cb => {
                score += parseInt(cb.value);
            });

            // 危険度の判定とコメント
            let evaluation = "";
            let advice = "";

            if (score === 0) {
                evaluation = "安全：精神の寄生は認められません。";
                advice = "あなたは現時点でパチンコに支配されていません。e東京喰種などのパチンコは、打つだけで数学的・脳科学的な破滅の罠に足を踏み入れることになります。今後も一切近づかないことを強く推奨します。";
            } else if (score <= 3) {
                evaluation = "軽度警告：『喰種』があなたの脳に囁きかけています。";
                advice = "「ちょっとした娯楽」「まだ負け額を取り戻せる」と軽く考えていませんか？ この段階で引き返さなければ、脳の間欠強化（ギャンブル脳へのハッキング）が本格的に進行し、やめられなくなります。今すぐ打つのをやめ、空いた時間を他の健全な趣味や投資に回しましょう。";
            } else if (score <= 6) {
                evaluation = "中度警戒：脳の神経回路がすでに半分喰われています。";
                advice = "予定額以上の投資、負けを取り返そうとする躍起。これは完全に依存症の初期〜中期症状です。あなたは自分の意思で打っているつもりですが、実際はパチンコ台のドーパミン刺激に脳をハッキングされています。今すぐ財布のカードをすべて自宅に置き、パチンコ店への出入りを「物理的に遮断」する行動をとってください。";
            } else {
                evaluation = "重度危険：『喰種化（依存の完全奴隷）』の極限状態です。";
                advice = "生活費の切り崩し、借金、虚偽、やめたくてもやめられない状態…。あなたの脳はギャンブルのドーパミン刺激なしでは正常に機能しないレベルまで破壊（ハッキング）されています。これは意志の強さだけで解決できる問題ではありません。今すぐ専門の医療機関（依存症外来）や相談窓口（GA、ワンデーポートなど）に連絡し、治療を受けてください。あなたの人生を取り戻すのは、今しかありません。";
            }

            checkScoreEl.textContent = score;
            checkEvalEl.textContent = evaluation;
            checkAdviceEl.textContent = advice;

            checkForm.classList.add("hidden");
            btnCalcScore.classList.add("hidden");
            checkResultBox.classList.remove("hidden");
        });

        // 診断リセット
        btnResetCheck.addEventListener("click", () => {
            checkForm.reset();
            checkResultBox.classList.add("hidden");
            checkForm.classList.remove("hidden");
            btnCalcScore.classList.remove("hidden");
        });

        // --- 7. 積立投資シミュレーター ---

        btnCalcInvest.addEventListener("click", () => {
            const monthlyLoss = parseFloat(inputMonthlyPachi.value);
            const years = parseInt(inputYears.value);
            const interestPercent = parseFloat(inputInterest.value);

            if (isNaN(monthlyLoss) || monthlyLoss <= 0 || isNaN(years) || years <= 0 || isNaN(interestPercent)) {
                alert("正しい数値を入力してください。");
                return;
            }

            // 1. パチンコでの単純損失合計
            // 実際はパチンコを長年続けると、期待値的に投資した額の約15%〜20%以上がマイナスになります。
            // ユーザーが「毎月パチンコで失っている（使っている）額」をそのまま積立額とするため、
            // 「パチンコ損失額＝失った額そのもの」と定義します。
            const totalLostPachi = monthlyLoss * 12 * years;

            // 2. 積立投資の複利計算
            // 月利換算
            const monthlyInterest = (interestPercent / 100) / 12;
            const totalMonths = years * 12;
            let totalInvestAsset = 0;

            for (let month = 1; month <= totalMonths; month++) {
                // 毎月の頭に積み立て、月利で運用
                totalInvestAsset = (totalInvestAsset + monthlyLoss) * (1 + monthlyInterest);
            }

            // 差額の計算
            const diff = totalInvestAsset + totalLostPachi; // パチンコのマイナス分＋投資のプラス分＝実質的な格差

            // UI更新
            futurePachiTitle.textContent = `${years}年間のパチンコ損失額`;
            futurePachiLost.textContent = `-${Math.round(totalLostPachi).toLocaleString()}円`;
            
            futureInvestTitle.textContent = `${years}年後の積立運用資産`;
            futureInvestGain.textContent = `${Math.round(totalInvestAsset).toLocaleString()}円`;

            futureDiffValue.textContent = Math.round(diff).toLocaleString();
        });

        // --- 8. 初期化処理 ---
        initAddictionAdvice();
        initSelfCheck();
        updateRealtimeUI();
        
        // 積立計算の初期実行
        btnCalcInvest.click();
    });
