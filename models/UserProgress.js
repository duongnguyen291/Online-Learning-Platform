class UserProgress {
    constructor({
        UserCode,
        CourseCode,
        Status,
        Progress,
        TimeSpent,
        LastAccessed,
        Notes,
        CompletedAt
    }) {
        this.UserCode = UserCode;
        this.CourseCode = CourseCode;
        this.Status = Status || 'not-started';
        this.Progress = Progress || 0;
        this.TimeSpent = TimeSpent || 0;
        this.LastAccessed = LastAccessed ? new Date(LastAccessed) : new Date();
        this.Notes = Notes || '';
        this.CompletedAt = CompletedAt ? new Date(CompletedAt) : null;
    }

    // Validate the status value
    static validateStatus(status) {
        const validStatuses = ['not-started', 'in-progress', 'completed'];
        return validStatuses.includes(status);
    }

    // Validate progress value (0-100)
    static validateProgress(progress) {
        return progress >= 0 && progress <= 100;
    }

    // Format time spent in minutes to hours and minutes
    formatTimeSpent() {
        const hours = Math.floor(this.TimeSpent / 60);
        const minutes = this.TimeSpent % 60;
        return `${hours}h ${minutes}m`;
    }

    // Check if the course is completed
    isCompleted() {
        return this.Status === 'completed' && this.Progress === 100;
    }

    // Create a UserProgress instance from JSON data
    static fromJSON(json) {
        return new UserProgress({
            UserCode: json.UserCode,
            CourseCode: json.CourseCode,
            Status: json.Status,
            Progress: json.Progress,
            TimeSpent: json.TimeSpent,
            LastAccessed: json.LastAccessed,
            Notes: json.Notes,
            CompletedAt: json.CompletedAt
        });
    }

    // Convert to JSON format
    toJSON() {
        return {
            UserCode: this.UserCode,
            CourseCode: this.CourseCode,
            Status: this.Status,
            Progress: this.Progress,
            TimeSpent: this.TimeSpent,
            LastAccessed: this.LastAccessed?.toISOString(),
            Notes: this.Notes,
            CompletedAt: this.CompletedAt?.toISOString()
        };
    }

    // Update progress
    updateProgress(newProgress) {
        if (!UserProgress.validateProgress(newProgress)) {
            throw new Error('Invalid progress value. Progress must be between 0 and 100.');
        }
        this.Progress = newProgress;
        this.LastAccessed = new Date();
        
        if (newProgress === 0) {
            this.Status = 'not-started';
        } else if (newProgress === 100) {
            this.Status = 'completed';
            this.CompletedAt = new Date();
        } else {
            this.Status = 'in-progress';
        }
    }

    // Update time spent
    addTimeSpent(minutes) {
        if (minutes < 0) {
            throw new Error('Time spent cannot be negative.');
        }
        this.TimeSpent += minutes;
        this.LastAccessed = new Date();
        
        // Update status if not already completed
        if (this.Status !== 'completed' && this.TimeSpent > 0) {
            this.Status = 'in-progress';
        }
    }
}

module.exports = UserProgress; 