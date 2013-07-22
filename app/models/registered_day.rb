class RegisteredDay < ActiveRecord::Base
  belongs_to :registration

  def start_to_s
    self.day.to_s + self.start.strftime("%H%M")
  end

  def end_to_s
    self.day.to_s + self.start.strftime("%H%M")
  end

  def to_img_bar()
    width = 7
    block_seconds = 30 * 60
    block_height = 16
    url = "/images/1x1/" + Colors.one(self.registration.student.user_id).upcase + ".png"
    height = (((self.end.to_i - self.start.to_i) / block_seconds.to_f) * block_height).round - 1
    <<BLOCK
      <img src="#{url}" width="#{width}" height="#{height}" style="cursor: pointer" class="calendar_bar bar_#{self.registration_id}" alt="#{self.id}" onmouseover="time_bar_mouseover(this.alt);" onmouseout="time_bar_mouseout();" onclick="time_bar_click(this.alt);" />
BLOCK
  end

  def to_hash
    {
        :student_name => self.registration.student.to_s,
        :parent_name => self.registration.student.user.fullname,
        :user_input => self.user_input,
        :color => Colors.one(self.registration.student.user_id),
        :date => self.day,
        :duration => self.registration.lesson_duration,
        :registration_id => self.registration_id,
        :student_comment => self.registration.student.comment
    }
  end
end
