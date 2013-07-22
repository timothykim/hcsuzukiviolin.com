class Lesson < ActiveRecord::Base
  belongs_to :registration
  belongs_to :location

  def get_date
    self.time.strftime("%a, %b. %d")
  end

  def get_time
    self.time.strftime("%I:%M%p") + " - " + (self.time + (self.duration * 60)).strftime("%I:%M%p")
  end

  def get_end_time
    self.time + (self.duration * 60)
  end
  
  def to_hash
    data = { :start => self.time.to_i,
             :color => Colors.one(self.registration.student.user_id),
             :duration => self.duration,
             :student_name => self.registration.student.first_name.at(0) + ". " + self.registration.student.last_name,
             :full_name => self.registration.student.to_s,
             :parent_name => self.registration.student.user.fullname,
             :date_id => self.time.strftime("%Y-%m-%d"),
             :start_time => self.time.strftime("%I:%M%p"),
             :end_time => (self.time + (self.duration * 60)).strftime("%I:%M%p"),
             :id => self.id,
             :r_id => self.registration_id,
             :numbering => self.registration.lessons.index(self) + 1,
             :out_of => self.registration.lessons.length,
             :date => self.time.strftime("%m/%d/%Y"),
             :day => self.time.wday,
             :recurring => self.is_recurring
    }
    return data
  end

  def to_json
    return self.to_hash.to_json
  end

end
