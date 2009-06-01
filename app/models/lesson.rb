class Lesson < ActiveRecord::Base
  belongs_to :registration

  def to_hash
    data = { :start => self.time.to_i,
             :color => Colors.one(self.registration.student.user_id),
             :duration => self.duration,
             :student_name => self.registration.student.first_name.at(0) + ". " + self.registration.student.last_name,
             :full_name => self.registration.student.to_s,
             :date => self.time.strftime("%m/%d/%Y"),
             :time => self.time.strftime("%I:%M%p") + "-" + (self.time + (self.duration * 60)).strftime("%I:%M%p"),
             :id => self.id,
             :r_id => self.registration_id,
             :numbering => self.registration.lessons.index(self)
    }
    return data
  end

  def to_json
    return self.to_hash.to_json
  end
end
