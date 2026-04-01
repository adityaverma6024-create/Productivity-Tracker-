export const playSound = (type: 'open' | 'add' | 'complete' | 'delete' | 'dayComplete' | 'trophy' | 'click' | 'toggle' | 'save' | 'timerComplete', enabled: boolean = true) => {
  if (!enabled) return;
  
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    switch (type) {
      case 'click':
      case 'toggle':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      case 'add':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'complete':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.setValueAtTime(1200, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
        break;
      case 'delete':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case 'open':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.15);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      case 'save':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.setValueAtTime(750, now + 0.1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;
      case 'dayComplete':
        // A nice chord
        const osc2 = ctx.createOscillator();
        const osc3 = ctx.createOscillator();
        osc.type = 'sine'; osc2.type = 'sine'; osc3.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc2.frequency.setValueAtTime(659.25, now); // E5
        osc3.frequency.setValueAtTime(783.99, now); // G5
        
        osc2.connect(gain); osc3.connect(gain);
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1);
        
        osc.start(now); osc2.start(now); osc3.start(now);
        osc.stop(now + 1); osc2.stop(now + 1); osc3.stop(now + 1);
        break;
      case 'trophy':
        // Triumphant arpeggio
        const tOsc = ctx.createOscillator();
        const tGain = ctx.createGain();
        tOsc.connect(tGain);
        tGain.connect(ctx.destination);
        tOsc.type = 'triangle';
        
        tOsc.frequency.setValueAtTime(440, now); // A4
        tOsc.frequency.setValueAtTime(554.37, now + 0.15); // C#5
        tOsc.frequency.setValueAtTime(659.25, now + 0.3); // E5
        tOsc.frequency.setValueAtTime(880, now + 0.45); // A5
        
        tGain.gain.setValueAtTime(0, now);
        tGain.gain.linearRampToValueAtTime(0.1, now + 0.05);
        tGain.gain.setValueAtTime(0.1, now + 0.45);
        tGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        tOsc.start(now);
        tOsc.stop(now + 1.5);
        break;
      case 'timerComplete':
        // Relaxing singing bowl / chime sound lasting 5 seconds
        const bowlOsc = ctx.createOscillator();
        const bowlOsc2 = ctx.createOscillator();
        const bowlGain = ctx.createGain();
        
        bowlOsc.connect(bowlGain);
        bowlOsc2.connect(bowlGain);
        bowlGain.connect(ctx.destination);
        
        bowlOsc.type = 'sine';
        bowlOsc2.type = 'sine';
        
        // Base frequency and a slight detune for a rich, relaxing sound
        bowlOsc.frequency.setValueAtTime(432, now); // 432Hz is often considered relaxing
        bowlOsc2.frequency.setValueAtTime(436, now);
        
        bowlGain.gain.setValueAtTime(0, now);
        bowlGain.gain.linearRampToValueAtTime(0.15, now + 0.5); // Slow attack
        bowlGain.gain.exponentialRampToValueAtTime(0.001, now + 5); // Long 5s decay
        
        bowlOsc.start(now);
        bowlOsc2.start(now);
        bowlOsc.stop(now + 5);
        bowlOsc2.stop(now + 5);
        break;
    }
  } catch (e) {
    // Ignore audio errors
  }
};

export const triggerHaptic = (type: 'light' | 'medium' | 'success', enabled: boolean = true) => {
  if (!enabled) return;
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    switch (type) {
      case 'light':
        navigator.vibrate(10);
        break;
      case 'medium':
        navigator.vibrate(20);
        break;
      case 'success':
        navigator.vibrate([10, 50, 20]);
        break;
    }
  }
};
