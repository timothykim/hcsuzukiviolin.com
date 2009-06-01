class RegisteredDate < ActiveRecord::Base
  belongs_to :registration

  def clean?
    not (self.start.nil? or self.end.nil?)
  end

  def floor(interval=30) #interval is in minutes
    s = self.start_time.to_i
    return Time.at(s - (s % (interval * 60)))
  end

  def start_time
    Time.parse([self.date.to_s, self.start.strftime("%H:%M")].join(" "))
  end

  def end_time
    Time.parse([self.date.to_s, self.end.strftime("%H:%M")].join(" "))
  end

  def to_img_bar(block_time)
    width = 7
    block_seconds = 30 * 60
    block_height = 16
    url = "/images/1x1/" + Colors.one(self.registration.student.user_id).upcase + ".png"
    height = (((self.end_time.to_i - self.start_time.to_i) / block_seconds.to_f) * block_height).round - 1
    offset = (((block_time.to_i - self.start_time.to_i) / block_seconds.to_f) * block_height).round
    cls = ""
    if self.preferred
      cls = "preferred"
      height -= 2
      width -= 2
    end

    <<BLOCK
      <img src="#{url}" width="#{width}" height="#{height}" style="margin-top: #{offset}px; cursor: pointer" class="#{cls} calendar_bar bar_#{self.registration_id}" alt="#{self.id}" onmouseover="time_bar_mouseover(this.alt);" onmouseout="time_bar_mouseout();" onclick="time_bar_click(this.alt);" />
BLOCK
  end

  def self.reparse_user_input
    self.all.each do |d|
      if d.user_input.index('*')
        d.preferred = true
      end
      time_str = d.user_input.gsub('*', '')
      tr = TimeRange.new(time_str)
      d.start = tr.start
      d.end = tr.done
      d.save
    end
  end

  def to_hash
    {
        :student_name => self.registration.student.to_s,
        :parent_name => self.registration.student.user.fullname,
        :user_input => self.user_input,
        :color => Colors.one(self.registration.student.user_id),
        :date => self.date.to_s.gsub("-","/"),
        :duration => self.registration.lesson_duration,
        :registration_id => self.registration_id
    }
  end
end
