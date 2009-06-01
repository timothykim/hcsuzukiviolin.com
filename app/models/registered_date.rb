class RegisteredDate < ActiveRecord::Base
  belongs_to :registration

  def clean?
    not (self.start.nil? or self.end.nil?)
  end

  def start_time
    Time.parse([self.date.to_s, self.start.strftime("%H:%M")].join(" "))
  end

  def end_time
    Time.parse([self.date.to_s, self.end.strftime("%H:%M")].join(" "))
  end

  def to_img_bar(block_time, preferred)
    width = 7
    block_seconds = 30 * 60
    block_height = 16
    url = "/images/1x1/" + Colors.one(self.registration.student.user_id).upcase + ".png"
    height = (((self.end_time.to_i - self.start_time.to_i) / block_seconds.to_f) * block_height).round - 1
    offset = (((block_time.to_i - self.start_time.to_i) / block_seconds.to_f) * block_height).round
    cls = ""
    cls = "preferred" if preferred

    <<BLOCK
      <img src="#{url}" width="#{width}" height="#{height}" style="margin-top: #{offset}px; cursor: pointer" class="#{cls} calendar_bar bar_#{self.registration_id}" alt="#{self.id}" />
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
end
